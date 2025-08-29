import { PrismaClient } from '@prisma/client';
import { sendSingleCandidateNotification } from './notificationService.js';

const prisma = new PrismaClient();

// Helper function to translate city names
async function translateCityName(cityName, lang = 'ru') {
  try {
    // First, find the city by name
    const city = await prisma.city.findFirst({
      where: { name: cityName },
      include: {
        translations: {
          where: { lang }
        }
      }
    });
    
    // Return translated name if available, otherwise return original name
    return city?.translations[0]?.name || cityName;
  } catch (error) {
    console.error('Error translating city name:', error);
    return cityName; // Fallback to original name
  }
}

function generateSlug(name, description) {
  return (name + '-' + description.split('\\n')[0])
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getAllSeekers(query = {}) {
  const { 
    page = 1, 
    limit = 10, 
    city, 
    category, 
    employment, 
    documentType, 
    languages, 
    gender, 
    isDemanded,
    lang = 'ru'
  } = query;

  // Service processing query

  // Build where clause for filtering
  const whereClause = {
    isActive: true,
  };

  if (city) {
    whereClause.city = city;
    // City filter applied
  }

  if (category) {
    whereClause.category = category;
    // Category filter applied
  }

  if (employment) {
    whereClause.employment = employment;
    // Employment filter applied
  }

  if (documentType) {
    whereClause.documentType = documentType;
    // Document type filter applied
  }

  if (languages && Array.isArray(languages) && languages.length > 0) {
    // Filter seekers who have any of the selected languages
    whereClause.languages = {
      hasSome: languages
    };
    // Languages filter applied
  }

  if (gender) {
    whereClause.gender = gender;
    // Gender filter applied
  }

  if (isDemanded !== undefined) {
    whereClause.isDemanded = isDemanded === 'true' || isDemanded === true;
    // IsDemanded filter applied
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Get total count for pagination
  const totalCount = await prisma.seeker.count({
    where: whereClause,
  });

  // Get seekers with pagination and filtering
  const seekers = await prisma.seeker.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });

  // Seekers retrieved successfully

  // Translate city names for all seekers
  const seekersWithTranslatedCities = await Promise.all(
    seekers.map(async (seeker) => ({
      ...seeker,
      city: await translateCityName(seeker.city, lang)
    }))
  );

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / take);

  return {
    seekers: seekersWithTranslatedCities,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalCount,
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1,
    }
  };
}

export async function createSeeker(data) {
  const { name, contact, city, description, gender, isDemanded, facebook, languages, nativeLanguage, category, employment, documents, announcement, note, documentType } = data;
  
  // Create the seeker
  const seeker = await prisma.seeker.create({
    data: {
      name,
      contact,
      city,
      description,
      gender,
      isDemanded,
      facebook,
      languages,
      nativeLanguage,
      category,
      employment,
      documents,
      announcement,
      note,
      documentType,
      slug: generateSlug(name, description)
    }
  });

  // Send notification to all users about the new candidate
  try {
    await sendSingleCandidateNotification(seeker);
  } catch (error) {
    console.error('❌ Failed to send notification for new candidate:', error);
    // Don't fail the seeker creation if notification fails
  }

  return seeker;
}

export async function getSeekerBySlug(slug) {
  return prisma.seeker.findUnique({ where: { slug } });
}

export async function deleteSeeker(id) {
  return prisma.seeker.delete({ where: { id: Number(id) } });
}

export async function getSeekerById(id) {
  return prisma.seeker.findUnique({ where: { id: Number(id) } });
}