import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
    isDemanded 
  } = query;

  console.log('🔍 Service received query:', query);
  console.log('🌍 Languages from query:', languages);

  // Build where clause for filtering
  const whereClause = {
    isActive: true,
  };

  if (city) {
    whereClause.city = city;
    console.log('🏙️ Added city filter:', city);
  }

  if (category) {
    whereClause.category = category;
    console.log('📂 Added category filter:', category);
  }

  if (employment) {
    whereClause.employment = employment;
    console.log('💼 Added employment filter:', employment);
  }

  if (documentType) {
    whereClause.documentType = documentType;
    console.log('📄 Added documentType filter:', documentType);
  }

  if (languages && Array.isArray(languages) && languages.length > 0) {
    // Filter seekers who have any of the selected languages
    whereClause.languages = {
      hasSome: languages
    };
    console.log('🗣️ Added languages filter:', languages);
  }

  if (gender) {
    whereClause.gender = gender;
    console.log('👤 Added gender filter:', gender);
  }

  if (isDemanded !== undefined) {
    whereClause.isDemanded = isDemanded === 'true' || isDemanded === true;
    console.log('⭐ Added isDemanded filter:', whereClause.isDemanded);
  }

  console.log('🔧 Final where clause:', whereClause);

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

  console.log(`📊 Found ${seekers.length} seekers out of ${totalCount} total`);
  
  // Log the first few seekers to see what was returned
  if (seekers.length > 0) {
    console.log('📋 First few seekers returned:', seekers.slice(0, 3).map(s => ({
      id: s.id,
      name: s.name,
      city: s.city,
      category: s.category,
      employment: s.employment,
      languages: s.languages,
      gender: s.gender,
      isDemanded: s.isDemanded
    })));
  } else {
    console.log('❌ No seekers found matching the filters');
  }

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / take);

  return {
    seekers,
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
  return prisma.seeker.create({
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