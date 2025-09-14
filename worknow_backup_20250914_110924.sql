--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS worknow;
--
-- Name: worknow; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE worknow WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE worknow OWNER TO postgres;

\connect worknow

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: CategoryTranslation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CategoryTranslation" (
    id integer NOT NULL,
    "categoryId" integer NOT NULL,
    lang text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."CategoryTranslation" OWNER TO postgres;

--
-- Name: CategoryTranslation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CategoryTranslation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."CategoryTranslation_id_seq" OWNER TO postgres;

--
-- Name: CategoryTranslation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CategoryTranslation_id_seq" OWNED BY public."CategoryTranslation".id;


--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Category_id_seq" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: City; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."City" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."City" OWNER TO postgres;

--
-- Name: CityTranslation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CityTranslation" (
    id integer NOT NULL,
    "cityId" integer NOT NULL,
    lang text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."CityTranslation" OWNER TO postgres;

--
-- Name: CityTranslation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CityTranslation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."CityTranslation_id_seq" OWNER TO postgres;

--
-- Name: CityTranslation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CityTranslation_id_seq" OWNED BY public."CityTranslation".id;


--
-- Name: City_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."City_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."City_id_seq" OWNER TO postgres;

--
-- Name: City_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."City_id_seq" OWNED BY public."City".id;


--
-- Name: DailyCandidateNotification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DailyCandidateNotification" (
    id integer NOT NULL,
    "sentAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "candidateCount" integer NOT NULL,
    "subscriberCount" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."DailyCandidateNotification" OWNER TO postgres;

--
-- Name: DailyCandidateNotification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DailyCandidateNotification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."DailyCandidateNotification_id_seq" OWNER TO postgres;

--
-- Name: DailyCandidateNotification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DailyCandidateNotification_id_seq" OWNED BY public."DailyCandidateNotification".id;


--
-- Name: Job; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Job" (
    id integer NOT NULL,
    title text NOT NULL,
    salary text NOT NULL,
    phone text NOT NULL,
    description text NOT NULL,
    "cityId" integer NOT NULL,
    "userId" text NOT NULL,
    "categoryId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "boostedAt" timestamp(3) without time zone,
    meals boolean,
    shuttle boolean,
    "imageUrl" text
);


ALTER TABLE public."Job" OWNER TO postgres;

--
-- Name: Job_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Job_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Job_id_seq" OWNER TO postgres;

--
-- Name: Job_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Job_id_seq" OWNED BY public."Job".id;


--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "clerkUserId" text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    type text NOT NULL,
    "fromAdminId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: NewsletterSubscriber; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NewsletterSubscriber" (
    id integer NOT NULL,
    email text NOT NULL,
    "firstName" text,
    "lastName" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    language text DEFAULT 'ru'::text NOT NULL,
    preferences jsonb,
    "onlyDemanded" boolean DEFAULT false NOT NULL,
    "preferredCategories" text[] DEFAULT ARRAY[]::text[],
    "preferredCities" text[] DEFAULT ARRAY[]::text[],
    "preferredDocumentTypes" text[] DEFAULT ARRAY[]::text[],
    "preferredEmployment" text[] DEFAULT ARRAY[]::text[],
    "preferredGender" text,
    "preferredLanguages" text[] DEFAULT ARRAY[]::text[]
);


ALTER TABLE public."NewsletterSubscriber" OWNER TO postgres;

--
-- Name: NewsletterSubscriber_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."NewsletterSubscriber_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."NewsletterSubscriber_id_seq" OWNER TO postgres;

--
-- Name: NewsletterSubscriber_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."NewsletterSubscriber_id_seq" OWNED BY public."NewsletterSubscriber".id;


--
-- Name: NewsletterVerification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NewsletterVerification" (
    id integer NOT NULL,
    email text NOT NULL,
    code text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."NewsletterVerification" OWNER TO postgres;

--
-- Name: NewsletterVerification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."NewsletterVerification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."NewsletterVerification_id_seq" OWNER TO postgres;

--
-- Name: NewsletterVerification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."NewsletterVerification_id_seq" OWNED BY public."NewsletterVerification".id;


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id integer NOT NULL,
    "clerkUserId" text NOT NULL,
    month text,
    amount integer NOT NULL,
    type integer NOT NULL,
    date timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- Name: Payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Payment_id_seq" OWNER TO postgres;

--
-- Name: Payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Payment_id_seq" OWNED BY public."Payment".id;


--
-- Name: Seeker; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Seeker" (
    id integer NOT NULL,
    name text NOT NULL,
    contact text NOT NULL,
    city text NOT NULL,
    description text NOT NULL,
    slug text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isDemanded" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    gender text,
    facebook text,
    languages text[],
    "nativeLanguage" text,
    employment text,
    category text,
    documents text,
    note text,
    announcement text,
    "documentType" text
);


ALTER TABLE public."Seeker" OWNER TO postgres;

--
-- Name: Seeker_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Seeker_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Seeker_id_seq" OWNER TO postgres;

--
-- Name: Seeker_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Seeker_id_seq" OWNED BY public."Seeker".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "clerkUserId" text NOT NULL,
    "firstName" text,
    "imageUrl" text,
    "isAutoRenewal" boolean DEFAULT true NOT NULL,
    "isPremium" boolean DEFAULT false NOT NULL,
    "lastName" text,
    "premiumEndsAt" timestamp(3) without time zone,
    "stripeSubscriptionId" text,
    "premiumDeluxe" boolean DEFAULT false NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: CategoryTranslation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CategoryTranslation" ALTER COLUMN id SET DEFAULT nextval('public."CategoryTranslation_id_seq"'::regclass);


--
-- Name: City id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."City" ALTER COLUMN id SET DEFAULT nextval('public."City_id_seq"'::regclass);


--
-- Name: CityTranslation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CityTranslation" ALTER COLUMN id SET DEFAULT nextval('public."CityTranslation_id_seq"'::regclass);


--
-- Name: DailyCandidateNotification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DailyCandidateNotification" ALTER COLUMN id SET DEFAULT nextval('public."DailyCandidateNotification_id_seq"'::regclass);


--
-- Name: Job id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job" ALTER COLUMN id SET DEFAULT nextval('public."Job_id_seq"'::regclass);


--
-- Name: NewsletterSubscriber id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NewsletterSubscriber" ALTER COLUMN id SET DEFAULT nextval('public."NewsletterSubscriber_id_seq"'::regclass);


--
-- Name: NewsletterVerification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NewsletterVerification" ALTER COLUMN id SET DEFAULT nextval('public."NewsletterVerification_id_seq"'::regclass);


--
-- Name: Payment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment" ALTER COLUMN id SET DEFAULT nextval('public."Payment_id_seq"'::regclass);


--
-- Name: Seeker id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Seeker" ALTER COLUMN id SET DEFAULT nextval('public."Seeker_id_seq"'::regclass);


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name) FROM stdin;
146	Стройка
147	Уборка
148	Бьюти-индустрия
149	Гостиницы
150	Доставка
151	Перевозка
152	Автосервис
153	Завод
154	Здоровье
155	Инженеры
156	Няни
157	Охрана
158	Офис
159	Общепит
160	Плотник
161	Ремонт
162	Образование
163	Медицина
164	Склад
165	Сварщик
166	Связь-телекоммуникации
167	Сельское хозяйство
168	Уход за пожилыми
169	Транспорт
170	Торговля
171	Производство
172	Швеи
173	Электрик
174	Разное
\.


--
-- Data for Name: CategoryTranslation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CategoryTranslation" (id, "categoryId", lang, name) FROM stdin;
436	146	ru	Стройка
437	146	he	בנייה
438	146	en	Construction
439	147	ru	Уборка
440	147	he	ניקיון
441	147	en	Cleaning
442	148	ru	Бьюти-индустрия
443	148	he	תעשיית היופי
444	148	en	Beauty industry
445	149	ru	Гостиницы
446	149	he	מלונאות
447	149	en	Hotels
448	150	ru	Доставка
449	150	he	שליחויות
450	150	en	Delivery
451	151	ru	Перевозка
452	151	he	הובלות
453	151	en	Transportation
454	152	ru	Автосервис
455	152	he	מוסך
456	152	en	Auto service
457	153	ru	Завод
458	153	he	מפעל
459	153	en	Factory
460	154	ru	Здоровье
461	154	he	בריאות
462	154	en	Health
463	155	ru	Инженеры
464	155	he	מהנדסים
465	155	en	Engineers
466	156	ru	Няни
467	156	he	מטפלות
468	156	en	Nannies
469	157	ru	Охрана
470	157	he	אבטחה
471	157	en	Security
472	158	ru	Офис
473	158	he	משרד
474	158	en	Office
475	159	ru	Общепит
476	159	he	הסעדה
477	159	en	Catering
478	160	ru	Плотник
479	160	he	נגר
480	160	en	Carpenter
481	161	ru	Ремонт
482	161	he	שיפוצים
483	161	en	Repair
484	162	ru	Образование
485	162	he	חינוך
486	162	en	Education
487	163	ru	Медицина
488	163	he	רפואה
489	163	en	Medicine
490	164	ru	Склад
491	164	he	מחסן
492	164	en	Warehouse
493	165	ru	Сварщик
494	165	he	רתך
495	165	en	Welder
496	166	ru	Связь-телекоммуникации
497	166	he	תקשורת
498	166	en	Telecommunications
499	167	ru	Сельское хозяйство
500	167	he	חקלאות
501	167	en	Agriculture
502	168	ru	Уход за пожилыми
503	168	he	טיפול בקשישים
504	168	en	Elderly care
505	169	ru	Транспорт
506	169	he	תחבורה
507	169	en	Transport
508	170	ru	Торговля
509	170	he	מסחר
510	170	en	Trade
511	171	ru	Производство
512	171	he	ייצור
513	171	en	Production
514	172	ru	Швеи
515	172	he	תופרות
516	172	en	Sewing
517	173	ru	Электрик
518	173	he	חשמלאי
519	173	en	Electrician
520	174	ru	Разное
521	174	he	שונות
522	174	en	Other
\.


--
-- Data for Name: City; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."City" (id, name) FROM stdin;
513	Центр страны
514	Юг страны
515	Север страны
516	Акко
517	Азур
518	Арад
519	Ариэль
520	Аррабе
521	Афула
522	Ашдод
523	Ашкелон
524	Бака эль Гарбия
525	Бат Ям
526	Бейт Шеан
527	Бейт Шемеш
528	Бейтар Илит
529	Беэр Шева
530	Беэр Яаков
531	Бней Брак
532	Бней Аиш
533	Ганей Тиква
534	Герцлия
535	Ган Явне
536	Гиватаим
537	Гиват Шмуэль
538	Димона
539	Иерусалим
540	Йехуд Моноссон
541	Йокнеам
542	Калансуа
543	Кармиэль
544	Кафр Кара
545	Кафр Касем
546	Кирьят Ата
547	Кирьят Бялик
548	Кирьят Хаим
549	Кирьят Гат
550	Кирьят Малахи
551	Кирьят Моцкин
552	Кирьят Оно
553	Кирьят Шмона
554	Кирьят Ям
555	Кфар Саба
556	Кфар Йона
557	Лод
558	Маале Адумим
559	Маалот Таршиха
560	Магар
561	Модиин
562	Мигдаль ха Эмек
563	Модиин Илит
564	Маалот
565	Модиин Маккабим Реут
566	Мигдаль Ха-Эмек
567	Нагария
568	Назарет
569	Ноф ха Галиль
570	Нес Циона
571	Натания
572	Нетивот
573	Наария
574	Нацрат Илит
575	Нешер
576	Ор Акива
577	Ор Йехуда
578	Офаким
579	Петах Тиква
580	Раанана
581	Рамат Ган
582	Рамла
583	Рахат
584	Реховот
585	Ришон ле Цион
586	Рош Аин
587	Сахнин
588	Сдерот
589	Тайбе
590	Тамра
591	Тверия
592	Тель Авив
593	Тира
594	Тират Кармель
595	Умм-эль Фахм
596	Хадера
597	Хайфа
598	Хедера
599	Ход Ха Шарон
600	Хариш
601	Холон
602	Цфат
603	Цомет Канот
604	Шефарам
605	Эйлат
606	Эльад
607	Явне
608	Рамат Ха Шарон
609	Кфар Авив
610	Кирьят Бял
611	Кейсария
612	Мицпе Рамон
613	Маалот-Таршиха
614	Пардес Хана
\.


--
-- Data for Name: CityTranslation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CityTranslation" (id, "cityId", lang, name) FROM stdin;
2049	513	ru	Центр страны
2050	513	he	מרכז הארץ
2051	513	en	Center
2052	513	ar	وسط البلاد
2053	514	ru	Юг страны
2054	514	he	דרום הארץ
2055	514	en	South
2056	514	ar	جنوب البلاد
2057	515	ru	Север страны
2058	515	he	צפון הארץ
2059	515	en	North
2060	515	ar	شمال البلاد
2061	516	ru	Акко
2062	516	he	עכו
2063	516	en	Akko
2064	516	ar	عكا
2065	517	ru	Азур
2066	517	he	אזור
2067	517	en	Azor
2068	517	ar	أزور
2069	518	ru	Арад
2070	518	he	ערד
2071	518	en	Arad
2072	518	ar	عراد
2073	519	ru	Ариэль
2074	519	he	אריאל
2075	519	en	Ariel
2076	519	ar	أريئيل
2077	520	ru	Аррабе
2078	520	he	עראבה
2079	520	en	Arraba
2080	520	ar	عرابة
2081	521	ru	Афула
2082	521	he	עפולה
2083	521	en	Afula
2084	521	ar	العفولة
2085	522	ru	Ашдод
2086	522	he	אשדוד
2087	522	en	Ashdod
2088	522	ar	أشدود
2089	523	ru	Ашкелон
2090	523	he	אשקלון
2091	523	en	Ashkelon
2092	523	ar	أشكلون
2093	524	ru	Бака эль Гарбия
2094	524	he	באקה אל-גרביה
2095	524	en	Baqa al-Gharbiyye
2096	524	ar	باقة الغربية
2097	525	ru	Бат Ям
2098	525	he	בת ים
2099	525	en	Bat Yam
2100	525	ar	بات يام
2101	526	ru	Бейт Шеан
2102	526	he	בית שאן
2103	526	en	Beit She'an
2104	526	ar	بيت شان
2105	527	ru	Бейт Шемеш
2106	527	he	בית שמש
2107	527	en	Beit Shemesh
2108	527	ar	بيت شيمش
2109	528	ru	Бейтар Илит
2110	528	he	ביתר עילית
2111	528	en	Beitar Illit
2112	528	ar	بيتر عيليت
2113	529	ru	Беэр Шева
2114	529	he	באר שבע
2115	529	en	Be'er Sheva
2116	529	ar	بئر السبع
2117	530	ru	Беэр Яаков
2118	530	he	באר יעקב
2119	530	en	Be'er Ya'akov
2120	530	ar	بئر يعقوب
2121	531	ru	Бней Брак
2122	531	he	בני ברק
2123	531	en	Bnei Brak
2124	531	ar	بني براك
2125	532	ru	Бней Аиш
2126	532	he	בני עיש
2127	532	en	Bnei Ayish
2128	532	ar	بني عايش
2129	533	ru	Ганей Тиква
2130	533	he	גני תקווה
2131	533	en	Ganei Tikva
2132	533	ar	جاني تيكفا
2133	534	ru	Герцлия
2134	534	he	הרצליה
2135	534	en	Herzliya
2136	534	ar	هرتسليا
2137	535	ru	Ган Явне
2138	535	he	גן יבנה
2139	535	en	Gan Yavne
2140	535	ar	جان يفنه
2141	536	ru	Гиватаим
2142	536	he	גבעתיים
2143	536	en	Giv'atayim
2144	536	ar	جفعاتايم
2145	537	ru	Гиват Шмуэль
2146	537	he	גבעת שמואל
2147	537	en	Giv'at Shmuel
2148	537	ar	جفعات شموئيل
2149	538	ru	Димона
2150	538	he	דימונה
2151	538	en	Dimona
2152	538	ar	ديمونا
2153	539	ru	Иерусалим
2154	539	he	ירושלים
2155	539	en	Jerusalem
2156	539	ar	القدس
2157	540	ru	Йехуд Моноссон
2158	540	he	יהוד מונוסון
2159	540	en	Yehud Monosson
2160	540	ar	يهود مونوسون
2161	541	ru	Йокнеам
2162	541	he	יקנעם
2163	541	en	Yokneam
2164	541	ar	يوكنعام
2165	542	ru	Калансуа
2166	542	he	קלנסווה
2167	542	en	Kalansuwa
2168	542	ar	قلنسوة
2169	543	ru	Кармиэль
2170	543	he	כרמיאל
2171	543	en	Karmiel
2172	543	ar	كرميئيل
2173	544	ru	Кафр Кара
2174	544	he	כפר קרע
2175	544	en	Kafr Qara
2176	544	ar	كفر قرع
2177	545	ru	Кафр Касем
2178	545	he	כפר קאסם
2179	545	en	Kafr Qasim
2180	545	ar	كفر قاسم
2181	546	ru	Кирьят Ата
2182	546	he	קריית אתא
2183	546	en	Kiryat Ata
2184	546	ar	كريات آتا
2185	547	ru	Кирьят Бялик
2186	547	he	קריית ביאליק
2187	547	en	Kiryat Bialik
2188	547	ar	كريات بياليك
2189	548	ru	Кирьят Хаим
2190	548	he	קריית חיים
2191	548	en	Kiryat Haim
2192	548	ar	كريات حاييم
2193	549	ru	Кирьят Гат
2194	549	he	קריית גת
2195	549	en	Kiryat Gat
2196	549	ar	كريات جات
2197	550	ru	Кирьят Малахи
2198	550	he	קריית מלאכי
2199	550	en	Kiryat Malakhi
2200	550	ar	كريات ملاخي
2201	551	ru	Кирьят Моцкин
2202	551	he	קריית מוצקין
2203	551	en	Kiryat Motzkin
2204	551	ar	كريات موتسكين
2205	552	ru	Кирьят Оно
2206	552	he	קריית אונו
2207	552	en	Kiryat Ono
2208	552	ar	كريات أونو
2209	553	ru	Кирьят Шмона
2210	553	he	קריית שמונה
2211	553	en	Kiryat Shmona
2212	553	ar	كريات شمونة
2213	554	ru	Кирьят Ям
2214	554	he	קריית ים
2215	554	en	Kiryat Yam
2216	554	ar	كريات يام
2217	555	ru	Кфар Саба
2218	555	he	כפר סבא
2219	555	en	Kfar Saba
2220	555	ar	كفار سابا
2221	556	ru	Кфар Йона
2222	556	he	כפר יונה
2223	556	en	Kfar Yona
2224	556	ar	كفار يونا
2225	557	ru	Лод
2226	557	he	לוד
2227	557	en	Lod
2228	557	ar	اللد
2229	558	ru	Маале Адумим
2230	558	he	מעלה אדומים
2231	558	en	Ma'ale Adumim
2232	558	ar	معاليه أدوميم
2233	559	ru	Маалот Таршиха
2234	559	he	מעלות תרשיחא
2235	559	en	Ma'alot-Tarshiha
2236	559	ar	معالوت ترشيحا
2237	560	ru	Магар
2238	560	he	מגאר
2239	560	en	Maghar
2240	560	ar	مغار
2241	561	ru	Модиин
2242	561	he	מודיעין
2243	561	en	Modiin
2244	561	ar	موديعين
2245	562	ru	Мигдаль ха Эмек
2246	562	he	מגדל העמק
2247	562	en	Migdal HaEmek
2248	562	ar	مجدال هعيمك
2249	563	ru	Модиин Илит
2250	563	he	מודיעין עילית
2251	563	en	Modiin Illit
2252	563	ar	موديعين عيليت
2253	564	ru	Маалот
2254	564	he	מעלות
2255	564	en	Ma'alot
2256	564	ar	معالوت
2257	565	ru	Модиин Маккабим Реут
2258	565	he	מודיעין מכבים רעות
2259	565	en	Modiin Maccabim Reut
2260	565	ar	موديعين مكابيم رعوت
2261	566	ru	Мигдаль Ха-Эмек
2262	566	he	מגדל העמק
2263	566	en	Migdal HaEmek
2264	566	ar	مجدال هعيمك
2265	567	ru	Нагария
2266	567	he	נהריה
2267	567	en	Nahariya
2268	567	ar	نهاريا
2269	568	ru	Назарет
2270	568	he	נצרת
2271	568	en	Nazareth
2272	568	ar	الناصرة
2273	569	ru	Ноф ха Галиль
2274	569	he	נוף הגליל
2275	569	en	Nof HaGalil
2276	569	ar	نوف هجليل
2277	570	ru	Нес Циона
2278	570	he	נס ציונה
2279	570	en	Ness Ziona
2280	570	ar	نس تسيونا
2281	571	ru	Натания
2282	571	he	נתניה
2283	571	en	Netanya
2284	571	ar	نتانيا
2285	572	ru	Нетивот
2286	572	he	נתיבות
2287	572	en	Netivot
2288	572	ar	نتيفوت
2289	573	ru	Наария
2290	573	he	נהריה
2291	573	en	Nahariya
2292	573	ar	نهاريا
2293	574	ru	Нацрат Илит
2294	574	he	נצרת עילית
2295	574	en	Nazareth Illit
2296	574	ar	الناصرة العليا
2297	575	ru	Нешер
2298	575	he	נשר
2299	575	en	Nesher
2300	575	ar	نيشر
2301	576	ru	Ор Акива
2302	576	he	אור עקיבא
2303	576	en	Or Akiva
2304	576	ar	أور عكيفا
2305	577	ru	Ор Йехуда
2306	577	he	אור יהודה
2307	577	en	Or Yehuda
2308	577	ar	أور يهودا
2309	578	ru	Офаким
2310	578	he	אופקים
2311	578	en	Ofakim
2312	578	ar	أوفاكيم
2313	579	ru	Петах Тиква
2314	579	he	פתח תקווה
2315	579	en	Petah Tikva
2316	579	ar	بيتاح تكفا
2317	580	ru	Раанана
2318	580	he	רעננה
2319	580	en	Ra'anana
2320	580	ar	رعنانا
2321	581	ru	Рамат Ган
2322	581	he	רמת גן
2323	581	en	Ramat Gan
2324	581	ar	رمات جان
2325	582	ru	Рамла
2326	582	he	רמלה
2327	582	en	Ramla
2328	582	ar	الرملة
2329	583	ru	Рахат
2330	583	he	רהט
2331	583	en	Rahat
2332	583	ar	رهط
2333	584	ru	Реховот
2334	584	he	רחובות
2335	584	en	Rehovot
2336	584	ar	رحوفوت
2337	585	ru	Ришон ле Цион
2338	585	he	ראשון לציון
2339	585	en	Rishon LeZion
2340	585	ar	ريشون لتسيون
2341	586	ru	Рош Аин
2342	586	he	ראש העין
2343	586	en	Rosh HaAyin
2344	586	ar	روش هاعين
2345	587	ru	Сахнин
2346	587	he	סח'נין
2347	587	en	Sakhnin
2348	587	ar	سخنين
2349	588	ru	Сдерот
2350	588	he	שדרות
2351	588	en	Sderot
2352	588	ar	سديروت
2353	589	ru	Тайбе
2354	589	he	טייבה
2355	589	en	Tayibe
2356	589	ar	الطيبة
2357	590	ru	Тамра
2358	590	he	טמרה
2359	590	en	Tamra
2360	590	ar	طمرة
2361	591	ru	Тверия
2362	591	he	טבריה
2363	591	en	Tiberias
2364	591	ar	طبريا
2365	592	ru	Тель Авив
2366	592	he	תל אביב
2367	592	en	Tel Aviv
2368	592	ar	تل أبيب
2369	593	ru	Тира
2370	593	he	טירה
2371	593	en	Tira
2372	593	ar	الطيرة
2373	594	ru	Тират Кармель
2374	594	he	טירת כרמל
2375	594	en	Tirat Carmel
2376	594	ar	طيرة الكرمل
2377	595	ru	Умм-эль Фахм
2378	595	he	אום אל-פחם
2379	595	en	Umm al-Fahm
2380	595	ar	أم الفحم
2381	596	ru	Хадера
2382	596	he	חדרה
2383	596	en	Hadera
2384	596	ar	الخضيرة
2385	597	ru	Хайфа
2386	597	he	חיפה
2387	597	en	Haifa
2388	597	ar	حيفا
2389	598	ru	Хедера
2390	598	he	חדרה
2391	598	en	Hadera
2392	598	ar	الخضيرة
2393	599	ru	Ход Ха Шарон
2394	599	he	הוד השרון
2395	599	en	Hod HaSharon
2396	599	ar	هود هشارون
2397	600	ru	Хариш
2398	600	he	חריש
2399	600	en	Harish
2400	600	ar	حريش
2401	601	ru	Холон
2402	601	he	חולון
2403	601	en	Holon
2404	601	ar	حولون
2405	602	ru	Цфат
2406	602	he	צפת
2407	602	en	Safed
2408	602	ar	صفد
2409	603	ru	Цомет Канот
2410	603	he	צומת קנות
2411	603	en	Tzomet Kanot
2412	603	ar	مفترق كانوت
2413	604	ru	Шефарам
2414	604	he	שפרעם
2415	604	en	Shefa-'Amr
2416	604	ar	شفاعمرو
2417	605	ru	Эйлат
2418	605	he	אילת
2419	605	en	Eilat
2420	605	ar	إيلات
2421	606	ru	Эльад
2422	606	he	אלעד
2423	606	en	El'ad
2424	606	ar	إلعاد
2425	607	ru	Явне
2426	607	he	יבנה
2427	607	en	Yavne
2428	607	ar	يفنه
2429	608	ru	Рамат Ха Шарон
2430	608	he	רמת השרון
2431	608	en	Ramat HaSharon
2432	608	ar	رمات هشارون
2433	609	ru	Кфар Авив
2434	609	he	כפר אביב
2435	609	en	Kfar Aviv
2436	609	ar	كفار أبيب
2437	610	ru	Кирьят Бял
2438	610	he	קריית ביאליק
2439	610	en	Kiryat Bialik
2440	610	ar	كريات بياليك
2441	611	ru	Кейсария
2442	611	he	קיסריה
2443	611	en	Caesarea
2444	611	ar	قيصرية
2445	612	ru	Мицпе Рамон
2446	612	he	מצפה רמון
2447	612	en	Mitzpe Ramon
2448	612	ar	متسبيه رامون
2449	613	ru	Маалот-Таршиха
2450	613	he	מעלות תרשיחא
2451	613	en	Ma'alot-Tarshiha
2452	613	ar	معالوت ترشيحا
2453	614	ru	Пардес Хана
2454	614	he	פרדס חנה
2455	614	en	Pardes Hanna
2456	614	ar	برديس حنا
\.


--
-- Data for Name: DailyCandidateNotification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DailyCandidateNotification" (id, "sentAt", "candidateCount", "subscriberCount", "createdAt") FROM stdin;
1	2025-08-12 13:06:24.927	3	1	2025-08-12 13:06:24.933
\.


--
-- Data for Name: Job; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Job" (id, title, salary, phone, description, "cityId", "userId", "categoryId", "createdAt", "boostedAt", meals, shuttle, "imageUrl") FROM stdin;
735	Общая вакансия	69	+972-508308138	*Город Рош Аин\n*55 шек в час+переработки 125%\n*С 9-ого рабочего часа 69 шек\n*Немецкий завод по производству алюминиевых перегородок и балок, требуются работники:\n*Производство алюминиевых конструкций и перегородок.\n*Работа в комфортном прохладном проветрииваемом помещении\n*Работа не сложная,ничего тяжелого поднимать не нужно\n*Шлифовка конструкций, починка и т.д\n*Работа с инструментом.\n*Всему обучают и показывают .\n*С 6:00-17:00(можно работать по 12 часов)\n*5/6 смен в неделю.\n*Есть питание на предприятии.\n*Подходит мужчинам с синей бумагой или теудат зеутом.\n*Есть подвозки с Петах-Тиквы,\n*С других городов оплачиваем проездной.\n*Официальное трудоустройство\n* +972-508308138 Алёна	586	63931fac-806c-4588-8aba-417ddca0ef4e	174	2025-08-06 13:02:00.351	\N	\N	\N	\N
736	Общая вакансия	75	+972-508308138	*Город Рош Аин\n*Комфортная сидячая работа для женщин и мужчин\n*Сборка мелких деталей — всему обучают и показывают на месте\n*Чистый, кондиционированный завод/лаборатория электроники\n*47 шек в час + переработки по 125%\n*С 9-го рабочего часа 58.75 шек\n*С 8:00 до 17:00\n*Дополнительные часы — по желанию\n*5 смен в неделю (вс–чт)\n*Иногда возможны смены в пятницу с 8:00 до 13:00\n*Есть подвозка из Петах-Тиквы и Ариэля\n*Из других городов — оплачиваем проездной\n*Подходит женщинам и мужчинам с синей бумагой или теудат зеут\n* +972-508308138 Алёна	586	a53d946b-4e90-42a0-b2d2-7630974b8e89	174	2025-08-06 13:02:00.371	\N	\N	\N	\N
737	Продавец-консультант	72	+972-508308138	*Город Петах Тиква\n*58 шек в час+переработки 125%\n*Требуются работники на упаковку в оптовый мясной магазин\n*5/6 дней в неделю\n*Вс-Чт с 7:00-18:00\n*С 9-ого рабочего часа 72 шек\n*Пятница по желанию с 7:00-14:00\n*Оплачиваем проездной\n*Подходит мужчинам с синей бумагой или теудат зеутом.\n*Официальное трудоустройство\n* +972-508308138 Алёна	579	f5328884-48d3-489b-8f7c-8b891cea1e83	170	2025-08-06 13:02:00.374	\N	\N	\N	\N
738	Грузчик	75	+972-508308138	*Холон\n*55 шек в час+переработки 125%.\n*С 9-ого рабочего часа 68.75 шек\n*Требуется работник на склад алюминиевых плат,\n*Обязанности: ставить платы на станок , станок вырезает плату по размеру , потом плату нужно положить на палет, платы алюминиевые для облицовки зданий\n( место небольшое, аккуратное)\n*Всему обучают и показывают, работа не сложная\n*5/6 смен в неделю\n*С вс-чт с 6:30-18:30\n*С 9-ого рабочего часа 68.75 шек\n*В пятницу смены с 6:30-14:00\n*Подходит мужчинам с синей бумагой или теудат зеутом\n*Официальное трудоустройство\n*+972-508308138 Алёна	601	cbcc4eec-dd57-4486-9b0c-9efc017ca2c2	174	2025-08-06 13:02:00.377	\N	\N	\N	\N
739	Грузчик	45	+972538526739	ВАКАНСИИ В СУПЕРМАРКЕТЫ ПО ВСЕЙ СТРАНЕ\nЗвони сейчас: +972538526739\n●АШДОД\n— Раскладка товара\n\n● БЕЭР-ШЕВА\n— Заместитель руководителя — 40₪/час\n\n●КФАР-САБА\n— Мясник — 42–45₪/час\n\n●РАМАТ-ГАН (Криници)\n— Маадания (отдел готовой еды) — 40₪/час\n\n● РЕХОВОТ\n— Касса\n— Маадания\n\n●ПЕТАХ-ТИКВА\n— Кассир — 40₪/час\n\n● ГАНЕЙ АВИВ (ЛОД)\n— Маадания — 40₪/час\n— Раскладка — 40₪/час\n\n●ИЕРУСАЛИМ\n— Маадания\n— Касса\n— Раскладка\nМужчины и женщины\nСвязь: +972538526739	522	50acb0b2-9467-4ed4-b290-fc50a297f9f7	174	2025-08-06 13:02:00.38	\N	\N	\N	\N
740	Повар	50	+972538526739	ГЕРЦЛИЯ\nГостиница\nТребуются повара\nМожно со слабым опытом!\nОплата:\n— от 45 шек/час — со слабым опытом\n— 47–50 шек/час — с опытом работы\nЗВОНИ ПРЯМО СЕЙЧАС: +972538526739	534	91326ca3-5d0e-4982-88bf-8812dd5330c2	159	2025-08-06 13:02:00.382	\N	\N	\N	\N
741	Общая вакансия	60	+972535875519	❗️АШДОД, ПРАЧЕЧНАЯ\n❗️РАБОТА НЕ ФИЗИЧЕСКАЯ, ЛЁГКАЯ\n 08.00-17.00 (ИНОГДА 15.00-00.00)\n  ОПЛАТА: от 40 ШЕК/ЧАС (СУББОТА 60 ШЕК/ЧАС)\nПРОЕЗД ОПЛАЧИВАЕМ\nПИТАНИЕ ЕСТЬ\n✔️  ОПЫТ РАБОТЫ И ЗНАНИЕ ИВРИТА НЕ ТРЕБУЕТСЯ\n‼️ ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО‼️\n❗️ ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ❗️\nЗВОНИТЕ +972535875519 ИЛИ ПИШИТЕ WHATSAPP +972536232595	522	3dff2094-fcc8-4c3f-aa1a-9ee7b72ba45c	174	2025-08-06 13:02:00.384	\N	\N	\N	\N
742	Грузчик	35	+97253-852-6739	КЕЙСАРИЯ | СКЛАД ОДЕЖДЫ\nПодвозка из ХАЙФЫ\n\n✔️ Сбор заказов\n✔️ Упаковка заказов\n\nРабота не физическая, молодой коллектив\nГрафик: 07:00 – 17:00, 5 рабочих смен в неделю\nОплата:\n— Парни: от 40 шек/час\n— Девушки: от 35 шек/час + БОНУСЫ\nЕсть питание\nПодходят документы:\nВизы B1, Синяя бумага, Тэудат-Зеуд, украинцы\nОпыт и знание иврита не требуются!\nЗвони прямо сейчас или пиши в WhatsApp:\n+972 53-852-6739	597	e36fb991-2857-477a-9b38-d687411a1ed9	174	2025-08-06 13:02:00.386	\N	\N	\N	\N
743	Повар	50	+972538526739	ГЕРЦЛИЯ\nГостиница\nТребуются повара\nМожно со слабым опытом!\nОплата:\n— от 45 шек/час — со слабым опытом\n— 47–50 шек/час — с опытом работы\nЗВОНИ ПРЯМО СЕЙЧАС: +972538526739	534	0edaef2d-4013-4e98-84db-d61601c1a6e6	159	2025-08-06 13:02:00.389	\N	\N	\N	\N
766	Повар	50	+972538526739	ГЕРЦЛИЯ\nГостиница\nТребуются повара\nМожно со слабым опытом!\nОплата:\n— от 45 шек/час — со слабым опытом\n— 47–50 шек/час — с опытом работы\nЗВОНИ ПРЯМО СЕЙЧАС: +972538526739	534	640fac74-c82e-4439-8549-d6d318f3a2ae	159	2025-08-06 13:02:00.433	\N	\N	\N	\N
744	Общая вакансия	60	+972535875519	❗️АШДОД, ПРАЧЕЧНАЯ\n❗️РАБОТА НЕ ФИЗИЧЕСКАЯ, ЛЁГКАЯ\n 08.00-17.00 (ИНОГДА 15.00-00.00)\n  ОПЛАТА: от 40 ШЕК/ЧАС (СУББОТА 60 ШЕК/ЧАС)\nПРОЕЗД ОПЛАЧИВАЕМ\nПИТАНИЕ ЕСТЬ\n✔️  ОПЫТ РАБОТЫ И ЗНАНИЕ ИВРИТА НЕ ТРЕБУЕТСЯ\n‼️ ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО‼️\n❗️ ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ❗️\nЗВОНИТЕ +972535875519 ИЛИ ПИШИТЕ WHATSAPP +972536232595	522	7180c501-091d-4e9e-bd2c-dc84428361b8	174	2025-08-06 13:02:00.391	\N	\N	\N	\N
745	Уборщик	45	+972508114949	Уборка номеров и лобби в Гостинице.\nЗаработная плата 12.000-14.000 шекелей в месяц!\nСтавка 45 шекелей в час (официальное трудоустройство)\n(подходит парням и девушкам)\n\nРамат-Ган | Полная занятость\nУсловия:\nПитание в столовой\nИврит не требуется\nОбязанности:\nУборка номеров и общественных зон\nЗамена постельного белья, полотенец\nПоддержание чистоты на территории\n\nВажно: Для трудоустройства нужны документы, разрешающие работу в Израиле (рабочая виза, синяя бумага или паспорт Украины).\n\nКонтакты:\nWhatsApp/звонки: +972508114949 (Юля)	579	f117ea05-147c-41d2-8b15-f2dcf8686e1e	147	2025-08-06 13:02:00.395	\N	\N	\N	\N
746	Уборщик	45	+972508114949	Уборка номеров и лобби в Гостинице.\nЗ/П 12.000-14.000 шекелей в месяц!\nСтавка 45 шек/час (официальное трудоустройство)\n(подходит парням и девушкам)\n\nРамат-Ган | Полная занятость\nУсловия:\nПитание в столовой\nИврит не требуется\nОбязанности:\nУборка номеров и общественных зон\nЗамена постельного белья, полотенец\nПоддержание чистоты на территории\n\nВажно: Для трудоустройства нужны документы, разрешающие работу в Израиле (рабочая виза, синяя бумага или паспорт Украины).\n\nКонтакты:\nWhatsApp/звонки: +972508114949 (Юля)	581	77bcbcfc-95f6-46bc-a592-7c5e29a0a586	147	2025-08-06 13:02:00.397	\N	\N	\N	\N
747	Общая вакансия	60	+972535875519	❗️АШДОД, ПРАЧЕЧНАЯ\nТРЕБУЕТСЯ ДЕВУШКА\n❗️РАБОТА НЕ ФИЗИЧЕСКАЯ, ЛЁГКАЯ\n 08.00-17.00 (ИНОГДА 15.00-00.00)\n  ОПЛАТА: от 40 ШЕК/ЧАС (СУББОТА 60 ШЕК/ЧАС)\nПРОЕЗД ОПЛАЧИВАЕМ\nПИТАНИЕ ЕСТЬ\n✔️  ОПЫТ РАБОТЫ И ЗНАНИЕ ИВРИТА НЕ ТРЕБУЕТСЯ\n‼️ ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО‼️\n❗️ ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ❗️\nЗВОНИТЕ +972535875519 ИЛИ ПИШИТЕ WHATSAPP +972536232595	522	14ae09cd-7125-4a2d-8c4f-0fb4eb36c4bb	174	2025-08-06 13:02:00.4	\N	\N	\N	\N
748	Повар	50	+972538526739	ГЕРЦЛИЯ\nГостиница\nТребуются повара\nМожно со слабым опытом!\nОплата:\n— от 45 шек/час — со слабым опытом\n— 47–50 шек/час — с опытом работы\nЗВОНИ ПРЯМО СЕЙЧАС: +972538526739	534	363a06ca-33f5-4f4b-a992-8acadcd07df5	159	2025-08-06 13:02:00.401	\N	\N	\N	\N
749	Грузчик	35	+972535875519	❗️ХАЙФА❗️ СКЛАД ОДЕЖДЫ\nПодвозка в Кейсарию\n✔️ СБОР ЗАКАЗОВ, ✔️УПАКОВКА ЗАКАЗОВ\n❗️Работа не физическая, молодой колектив\n  Рабочие часы: 07.00 - 17.00,  Рабочих смен 5\n  ОПЛАТА: парни от 40 ШЕК/ЧАС, девушки от 35 ШЕК/ЧАС + БОНУСЫ 1000-1500 ШЕК\n  Есть питание\n  Визы Б1, Синяя бумага, Тэудат-Зеуд, Украинцы\n☑️  ОПЫТ И ЗНАНИЯ ИВРИТА НЕ ТРЕБУЮТСЯ\n\n‼️ ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО‼️\n❗️ ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ❗️\nЗвоните +972535875519 или пишите WhatsApp +972536232595	597	5c3d20b6-e4b5-4b6b-9b8d-8cb82c1f5901	174	2025-08-06 13:02:00.403	\N	\N	\N	\N
750	Повар	55	+972553014088	В Гостиницы в Тель-авиве требуются:\n- Горничные 45-50 шек/час\n- Работники на мойку посуды 45 ш/час\n- На уборку территорий 45-48 ш/час\n- Повара с опытом 45-55 шек/час\n- В ахзаку 50 шек/час\n- Официанты (иврит)40-50 ш/час\n- Также нужны сотрудники на уборку офисных зданий вТель Авиве. Работа утренние /вечерние смены по 3-8-12 часов. 40 шек/час\n\nОбращайтесь на WhatsApp +972553014088	592	3f73b96f-9e72-4529-a566-2e2c15cac862	159	2025-08-06 13:02:00.404	\N	\N	\N	\N
751	Грузчик	35	+972535875519	❗️ХАЙФА❗️ СКЛАД ОДЕЖДЫ\nПодвозка в Кейсарию\n✔️ СБОР ЗАКАЗОВ, ✔️УПАКОВКА ЗАКАЗОВ\n❗️Работа не физическая, молодой колектив  Рабочие часы: 07.00 - 17.00,  Рабочих смен 5\n  ОПЛАТА: парни от 40 ШЕК/ЧАС, девушки от 35 ШЕК/ЧАС + БОНУСЫ 1000-1500 ШЕК\n  Есть питание\n  Визы Б1, Синяя бумага, Тэудат-Зеуд, Украинцы\n☑️  ОПЫТ И ЗНАНИЯ ИВРИТА НЕ ТРЕБУЮТСЯ\n\n‼️ ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО‼️\n❗️ ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ❗️\nЗвоните +972535875519 или пишите WhatsApp +972536232595	597	d5d311ed-0556-4f61-8aa5-5f93db806cf0	174	2025-08-06 13:02:00.406	\N	\N	\N	\N
752	Общая вакансия	60	+972535875519	❗️АШДОД, ПРАЧЕЧНАЯ\nТРЕБУЕТСЯ ДЕВУШКА\n❗️РАБОТА НЕ ФИЗИЧЕСКАЯ, ЛЁГКАЯ\n 08.00-17.00 (ИНОГДА 15.00-00.00)\n  ОПЛАТА: от 40 ШЕК/ЧАС (СУББОТА 60 ШЕК/ЧАС)\nПРОЕЗД ОПЛАЧИВАЕМ\nПИТАНИЕ ЕСТЬ\n✔️  ОПЫТ РАБОТЫ И ЗНАНИЕ ИВРИТА НЕ ТРЕБУЕТСЯ\n‼️ ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО‼️\n❗️ ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ❗️\nЗВОНИТЕ +972535875519 ИЛИ ПИШИТЕ WHATSAPP +972536232595	522	936c831a-1593-4f9f-9833-f150696aac87	174	2025-08-06 13:02:00.408	\N	\N	\N	\N
753	Повар	50	+972538526739	ГЕРЦЛИЯ\nГостиница\nТребуются повара\nМожно со слабым опытом!\nОплата:\n— от 45 шек/час — со слабым опытом\n— 47–50 шек/час — с опытом работы\nЗВОНИ ПРЯМО СЕЙЧАС: +972538526739	534	ed9fc101-9200-479e-b015-22d0d0156a84	159	2025-08-06 13:02:00.41	\N	\N	\N	\N
780	Электрик	70	+972-50-1006	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1006	601	8c31af40-54fa-463c-a77d-15b5714b0d50	173	2025-08-06 13:02:00.461	\N	\N	\N	\N
754	Грузчик	45	+972538526739	ВАКАНСИИ В СУПЕРМАРКЕТЫ ПО ВСЕЙ СТРАНЕ\nЗвони сейчас: +972538526739\n●АШДОД\n— Раскладка товара\n\n● БЕЭР-ШЕВА\n— Заместитель руководителя — 40₪/час\n\n●КФАР-САБА\n— Мясник — 42–45₪/час\n\n●РАМАТ-ГАН (Криници)\n— Маадания (отдел готовой еды) — 40₪/час\n\n● РЕХОВОТ\n— Касса\n— Маадания\n\n●ПЕТАХ-ТИКВА\n— Кассир — 40₪/час\n\n● ГАНЕЙ АВИВ (ЛОД)\n— Маадания — 40₪/час\n— Раскладка — 40₪/час\n\n●ИЕРУСАЛИМ\n— Маадания\n— Касса\n— Раскладка\nМужчины и женщины\nСвязь: +972538526739	600	d4ebb75f-5583-4a40-9573-2c7cbc6f6e09	174	2025-08-06 13:02:00.412	\N	\N	\N	\N
755	Общая вакансия	60	+972535875519	❗️АШДОД, ПРАЧЕЧНАЯ\nТРЕБУЕТСЯ ДЕВУШКА\n❗️РАБОТА НЕ ФИЗИЧЕСКАЯ, ЛЁГКАЯ\n 08.00-17.00 (ИНОГДА 15.00-00.00)\n  ОПЛАТА: от 40 ШЕК/ЧАС (СУББОТА 60 ШЕК/ЧАС)\nПРОЕЗД ОПЛАЧИВАЕМ\nПИТАНИЕ ЕСТЬ\n✔️  ОПЫТ РАБОТЫ И ЗНАНИЕ ИВРИТА НЕ ТРЕБУЕТСЯ\n‼️ ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО‼️\n❗️ ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ❗️\nЗВОНИТЕ +972535875519 ИЛИ ПИШИТЕ WHATSAPP +972536232595	522	682e41c1-3c35-44c3-bea2-aa8ce3a9cf31	174	2025-08-06 13:02:00.414	\N	\N	\N	\N
756	Общая вакансия	110	+972552591214	Облицовка фасадов зданий нужны рабочие с опытом работы.\nТель Авив облицовка HPL 130 шек/кв.метр\nНаария облицовка HPL 110 шек/кв.метр\nНетания облицовка алюминием 55-60 шек/час или кабланут.\n\nWhatsApp +972552591214\nНе дозвонились оставьте сообщение на Ватсап-перезвоним.	513	d138522d-6c57-4547-97fd-a2da648ea815	174	2025-08-06 13:02:00.416	\N	\N	\N	\N
757	Кассир	40	+972538526739	РИШОН-ЛЕ-ЦИОН | КИРЬЯТ-ГАТ | АШДОД | БЕЭР-ТУВИЯ\nНовая сеть супермаркетов\nТребуются:\n— Мясники – 45 ₪ в час\n— Кассиры – 40 ₪ в час\nРабота доступна в нескольких городах!\nЗвони сейчас: +972538526739	522	9daf9379-f5d6-46a5-b985-97c248bea07e	170	2025-08-06 13:02:00.417	\N	\N	\N	\N
758	Кассир	40	+972538526739	‼️ РИШОН-ЛЕ-ЦИОН | КИРЬЯТ-ГАТ | АШДОД | БЕЭР-ТУВИЯ\nНовая сеть супермаркетов\nТребуются:\n— Мясники – 45 ₪ в час\n— Кассиры – 40 ₪ в час\nРабота доступна в нескольких городах!\nЗвони сейчас: +972538526739	585	77f9feb6-53c5-4fbd-bea7-baad38ecf6f7	170	2025-08-06 13:02:00.419	\N	\N	\N	\N
759	Общая вакансия	60	+972535875519	❗️АШДОД, ПРАЧЕЧНАЯ\nТРЕБУЕТСЯ ДЕВУШКА\n❗️РАБОТА НЕ ФИЗИЧЕСКАЯ, ЛЁГКАЯ\n 08.00-17.00 (ИНОГДА 15.00-00.00)\n  ОПЛАТА: от 40 ШЕК/ЧАС (СУББОТА 60 ШЕК/ЧАС)\nПРОЕЗД ОПЛАЧИВАЕМ\nПИТАНИЕ ЕСТЬ\n✔️  ОПЫТ РАБОТЫ И ЗНАНИЕ ИВРИТА НЕ ТРЕБУЕТСЯ\n‼️ ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО‼️\n❗️ ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ❗️\nЗВОНИТЕ +972535875519 ИЛИ ПИШИТЕ WHATSAPP +972536232595	522	1c4b9ed8-ac76-4cec-8442-61a0f5e9ede0	174	2025-08-06 13:02:00.42	\N	\N	\N	\N
760	Общая вакансия	42	+9720503261783	Работа на заводе в Модиине.\nГрафик работы: с 7:30 до 18:00 и дольше.\n\nЗарплата:\nРабочий на производстве — 50 шекелей в час.\nКомплектовщик заказов — 42 шекеля в час + бонусы за каждый собранный короб.\nХорошие работники могут получать бонусы до 2000 шекелей в месяц!\n\nЕсть возможность организовать транспорт из:\nПетах-Тиквы, Холона, Бать-Яма, Ор-Йехуды, Тель-Авива, Азора, Лода и Рамле.\n+9720503261783	513	1197c305-64d7-401e-a89d-2c76b81b333f	174	2025-08-06 13:02:00.422	\N	\N	\N	\N
761	Общая вакансия	42	+9720503261783	Работа на заводе в Модиине.\nГрафик работы: с 7:30 до 18:00 и дольше.\n\nЗарплата:\nРабочий на производстве — 50 шекелей в час.\nКомплектовщик заказов — 42 шекеля в час + бонусы за каждый собранный короб.\nХорошие работники могут получать бонусы до 2000 шекелей в месяц!\n\nЕсть возможность организовать транспорт из:\nПетах-Тиквы, Холона, Бать-Яма, Ор-Йехуды, Тель-Авива, Азора, Лода и Рамле.\n+9720503261783	561	0b3ce87b-51ae-45a2-ba48-738867d578ba	174	2025-08-06 13:02:00.424	\N	\N	\N	\N
762	Повар	50	+972538526739	ГЕРЦЛИЯ\nГостиница\nТребуются повара\nМожно со слабым опытом!\nОплата:\n— от 45 шек/час — со слабым опытом\n— 47–50 шек/час — с опытом работы\nЗВОНИ ПРЯМО СЕЙЧАС: +972538526739	534	97c7bfa4-20cf-4e64-a9a0-3a6a53c715c7	159	2025-08-06 13:02:00.426	\N	\N	\N	\N
763	Повар	50	+972538526739	ГЕРЦЛИЯ\nГостиница\nТребуются повара\nМожно со слабым опытом!\nОплата:\n— от 45 шек/час — со слабым опытом\n— 47–50 шек/час — с опытом работы\nЗВОНИ ПРЯМО СЕЙЧАС: +972538526739	534	cea1d9bf-c909-4e23-b32f-92cba03b831c	159	2025-08-06 13:02:00.428	\N	\N	\N	\N
764	Грузчик	35	+972535875519	❗️ХАЙФА❗️ СКЛАД ОДЕЖДЫ\nПодвозка в Кейсарию\n✔️ СБОР ЗАКАЗОВ, ✔️УПАКОВКА ЗАКАЗОВ\n❗️Работа не физическая, молодой колектив\n  Рабочие часы: 07.00 - 17.00,  Рабочих смен 5\n  ОПЛАТА: парни от 40 ШЕК/ЧАС, девушки от 35 ШЕК/ЧАС + БОНУСЫ 1000-1500 ШЕК\n  Есть питание\n  Визы Б1, Синяя бумага, Тэудат-Зеуд, Украинцы\n☑️  ОПЫТ И ЗНАНИЯ ИВРИТА НЕ ТРЕБУЮТСЯ\n\n‼️ ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО‼️\n❗️ ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ❗️\nЗвоните +972535875519 или пишите WhatsApp +972536232595	597	a0b1beeb-1ee8-4940-b44d-0a33c1319a67	174	2025-08-06 13:02:00.43	\N	\N	\N	\N
765	Общая вакансия	60	+972535875519	❗️АШДОД, ПРАЧЕЧНАЯ\nТРЕБУЕТСЯ ДЕВУШКА\n❗️РАБОТА НЕ ФИЗИЧЕСКАЯ, ЛЁГКАЯ\n 08.00-17.00 (ИНОГДА 15.00-00.00)\n  ОПЛАТА: от 40 ШЕК/ЧАС (СУББОТА 60 ШЕК/ЧАС)\nПРОЕЗД ОПЛАЧИВАЕМ\nПИТАНИЕ ЕСТЬ\n✔️  ОПЫТ РАБОТЫ И ЗНАНИЕ ИВРИТА НЕ ТРЕБУЕТСЯ\n‼️ ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО‼️\n❗️ ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ❗️\nЗВОНИТЕ +972535875519 ИЛИ ПИШИТЕ WHATSAPP +972536232595	522	ce4714c9-ab8f-400a-bbe7-4f7207a5b201	174	2025-08-06 13:02:00.431	\N	\N	\N	\N
767	Грузчик	35	+97253-852-6739	КЕЙСАРИЯ | СКЛАД ОДЕЖДЫ\nПодвозка из ХАЙФЫ\n\n✔️ Сбор заказов\n✔️ Упаковка заказов\n\nРабота не физическая, молодой коллектив\nГрафик: 07:00 – 17:00, 5 рабочих смен в неделю\nОплата:\n— Парни: от 40 шек/час\n— Девушки: от 35 шек/час + БОНУСЫ\nЕсть питание\nПодходят документы:\nВизы B1, Синяя бумага, Тэудат-Зеуд, украинцы\nОпыт и знание иврита не требуются!\nЗвони прямо сейчас или пиши в WhatsApp:\n+972 53-852-6739	597	fdec40d5-b46e-483e-b7f8-6d6100c7548b	174	2025-08-06 13:02:00.435	\N	\N	\N	\N
768	Грузчик	35	+97253-852-6739	КЕЙСАРИЯ | СКЛАД ОДЕЖДЫ\nПодвозка из ХАЙФЫ\n\n✔️ Сбор заказов\n✔️ Упаковка заказов\n\nРабота не физическая, молодой коллектив\nГрафик: 07:00 – 17:00, 5 рабочих смен в неделю\nОплата:\n— Парни: от 40 шек/час\n— Девушки: от 35 шек/час + БОНУСЫ\nЕсть питание\nПодходят документы:\nВизы B1, Синяя бумага, Тэудат-Зеуд, украинцы\nОпыт и знание иврита не требуются!\nЗвони прямо сейчас или пиши в WhatsApp:\n+972 53-852-6739	611	6c9a1b0a-45aa-48c7-8d27-b66fbfbdccd5	174	2025-08-06 13:02:00.438	\N	\N	\N	\N
769	Грузчик	35	+972535875519	❗️ХАЙФА❗️ СКЛАД ОДЕЖДЫ\nПодвозка в Кейсарию\n✔️ СБОР ЗАКАЗОВ, ✔️УПАКОВКА ЗАКАЗОВ\n❗️Работа не физическая, молодой колектив\n  Рабочие часы: 07.00 - 17.00,  Рабочих смен 5\n  ОПЛАТА: парни от 40 ШЕК/ЧАС, девушки от 35 ШЕК/ЧАС + БОНУСЫ 1000-1500 ШЕК\n  Есть питание\n  Визы Б1, Синяя бумага, Тэудат-Зеуд, Украинцы\n☑️  ОПЫТ И ЗНАНИЯ ИВРИТА НЕ ТРЕБУЮТСЯ\n\n‼️ ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО‼️\n❗️ ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ❗️\nЗвоните +972535875519 или пишите WhatsApp +972536232595	597	55b3ed9b-c462-4045-b34d-27511b0ba060	174	2025-08-06 13:02:00.439	\N	\N	\N	\N
770	Повар	50	+972538526739	ГЕРЦЛИЯ\nГостиница\nТребуются повара\nМожно со слабым опытом!\nОплата:\n— от 45 шек/час — со слабым опытом\n— 47–50 шек/час — с опытом работы\nЗВОНИ ПРЯМО СЕЙЧАС: +972538526739	534	426a52e9-0a2c-4af5-8ccb-000d6fe535c7	159	2025-08-06 13:02:00.441	\N	\N	\N	\N
771	Повар	50	+972538526739	‼️ ГЕРЦЛИЯ\nГостиница\nТребуются повара\nМожно со слабым опытом!\nОплата:\n— от 45 шек/час — со слабым опытом\n— 47–50 шек/час — с опытом работы\nЗВОНИ ПРЯМО СЕЙЧАС: +972538526739	534	2cbe1df5-e71f-4b65-85d6-bf21258dab60	159	2025-08-06 13:02:00.443	\N	\N	\N	\N
772	Общая вакансия	60	+972535875519	❗️АШДОД, ПРАЧЕЧНАЯ\nТРЕБУЕТСЯ ДЕВУШКА\n❗️РАБОТА НЕ ФИЗИЧЕСКАЯ, ЛЁГКАЯ\n 08.00-17.00 (ИНОГДА 15.00-00.00)\n  ОПЛАТА: от 40 ШЕК/ЧАС (СУББОТА 60 ШЕК/ЧАС)\nПРОЕЗД ОПЛАЧИВАЕМ\nПИТАНИЕ ЕСТЬ\n✔️  ОПЫТ РАБОТЫ И ЗНАНИЕ ИВРИТА НЕ ТРЕБУЕТСЯ\n‼️ ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО‼️\n❗️ ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ❗️\nЗВОНИТЕ +972535875519 ИЛИ ПИШИТЕ WHATSAPP +972536232595	522	d5277f3d-7180-4a8e-a6db-6cd98c429c10	174	2025-08-06 13:02:00.444	\N	\N	\N	\N
773	Грузчик	35	+97253-852-6739	КЕЙСАРИЯ | СКЛАД ОДЕЖДЫ\nПодвозка из ХАЙФЫ\n\n✔️ Сбор заказов\n✔️ Упаковка заказов\n\nРабота не физическая, молодой коллектив\nГрафик: 07:00 – 17:00, 5 рабочих смен в неделю\nОплата:\n— Парни: от 40 шек/час\n— Девушки: от 35 шек/час + БОНУСЫ\nЕсть питание\nПодходят документы:\nВизы B1, Синяя бумага, Тэудат-Зеуд, украинцы\n☑️ Опыт и знание иврита не требуются!\n? Звони прямо сейчас или пиши в WhatsApp:\n+972 53-852-6739\n\nЕсть много других вакансий по всей стране!	597	663dd893-9249-471d-85f4-eab6685bbdfb	174	2025-08-06 13:02:00.446	\N	\N	\N	\N
774	Повар	50	+972538526739	‼️ ГЕРЦЛИЯ\nГостиница\nТребуются повара\nМожно со слабым опытом!\nОплата:\n— от 45 шек/час — со слабым опытом\n— 47–50 шек/час — с опытом работы\nЗВОНИ ПРЯМО СЕЙЧАС: +972538526739	534	a138ea21-c33a-4aa2-a7c7-2ec9704a0cd7	159	2025-08-06 13:02:00.448	\N	\N	\N	\N
775	Общая вакансия	60	+972535875519	❗️АШДОД, ПРАЧЕЧНАЯ\nТРЕБУЕТСЯ ДЕВУШКА\n❗️РАБОТА НЕ ФИЗИЧЕСКАЯ, ЛЁГКАЯ\n 08.00-17.00 (ИНОГДА 15.00-00.00)\n  ОПЛАТА: от 40 ШЕК/ЧАС (СУББОТА 60 ШЕК/ЧАС)\nПРОЕЗД ОПЛАЧИВАЕМ\nПИТАНИЕ ЕСТЬ\n✔️  ОПЫТ РАБОТЫ И ЗНАНИЕ ИВРИТА НЕ ТРЕБУЕТСЯ\n‼️ ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО‼️\n❗️ ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ❗️\nЗВОНИТЕ +972535875519 ИЛИ ПИШИТЕ WHATSAPP +972536232595	522	fe36fa41-01a3-48c7-a7ca-1c41f4803dec	174	2025-08-06 13:02:00.45	\N	\N	\N	\N
776	Грузчик	35	+972535875519	❗️ХАЙФА❗️ СКЛАД ОДЕЖДЫ\nПодвозка в Кейсарию\n✔️ СБОР ЗАКАЗОВ, ✔️УПАКОВКА ЗАКАЗОВ\n❗️Работа не физическая, молодой колектив\n  Рабочие часы: 07.00 - 17.00,  Рабочих смен 5\n  ОПЛАТА: парни от 40 ШЕК/ЧАС, девушки от 35 ШЕК/ЧАС + БОНУСЫ 1000-1500 ШЕК\nЕсть питание\n  Визы Б1, Синяя бумага, Тэудат-Зеуд, Украинцы\n☑️  ОПЫТ И ЗНАНИЯ ИВРИТА НЕ ТРЕБУЮТСЯ\n\n‼️ ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО‼️\n❗️ ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ❗️\nЗвоните +972535875519 или пишите WhatsApp +972536232595	597	cad9f96f-bb7d-4c0d-a5f7-425578ec39ee	174	2025-08-06 13:02:00.452	\N	\N	\N	\N
777	Водитель доставки	50	+972-50-1001	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1001	597	5e737f31-6faa-4b66-adb3-b0c8fe7d4085	151	2025-08-06 13:02:00.454	\N	\N	\N	\N
778	Уборщица	40	+972-50-1002	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1002	539	cf049d41-ac16-4f9a-ba31-886dc9ffd8a8	147	2025-08-06 13:02:00.456	\N	\N	\N	\N
779	Продавец в магазин	55	+972-50-1003	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1003	522	3403362f-8977-4088-8e84-79f0cdfca2dd	170	2025-08-06 13:02:00.458	\N	\N	\N	\N
781	Садовник	45	+972-50-1008	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1008	536	dd2d1741-5059-4039-a8ab-3903d057af71	167	2025-08-06 13:02:00.463	\N	\N	\N	\N
782	Водитель доставки	50	+972-50-1011	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1011	597	f098f6c3-e713-4095-bdb0-3d5ab64dbb5f	151	2025-08-06 13:02:00.466	\N	\N	\N	\N
783	Уборщица	40	+972-50-1012	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1012	539	7c2354bd-b7f5-491b-a996-618c7586b86a	147	2025-08-06 13:02:00.468	\N	\N	\N	\N
784	Продавец в магазин	55	+972-50-1013	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1013	522	79f99e20-d91a-4dbb-ac74-63b3380d14a8	170	2025-08-06 13:02:00.471	\N	\N	\N	\N
785	Электрик	70	+972-50-1016	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1016	601	c21f439c-11af-4d38-9bf0-7f867694b28d	173	2025-08-06 13:02:00.473	\N	\N	\N	\N
786	Садовник	45	+972-50-1018	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1018	536	a06c1d1e-1339-4c1f-bdce-7f0fa83469a8	167	2025-08-06 13:02:00.476	\N	\N	\N	\N
787	Водитель доставки	50	+972-50-1021	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1021	597	5a2187b9-8d35-41bf-8020-609779e11824	151	2025-08-06 13:02:00.479	\N	\N	\N	\N
788	Уборщица	40	+972-50-1022	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1022	539	8bb2046c-a640-4553-a839-7ec402058329	147	2025-08-06 13:02:00.481	\N	\N	\N	\N
789	Продавец в магазин	55	+972-50-1023	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1023	522	1fe0d288-85ec-479a-96a8-6c6bb43d8b53	170	2025-08-06 13:02:00.483	\N	\N	\N	\N
790	Электрик	70	+972-50-1026	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1026	601	c290b606-e3f5-4b49-b750-af470d372ff9	173	2025-08-06 13:02:00.486	\N	\N	\N	\N
791	Садовник	45	+972-50-1028	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1028	536	b1857af7-7004-4f86-9134-153a908a979a	167	2025-08-06 13:02:00.488	\N	\N	\N	\N
792	Водитель доставки	50	+972-50-1031	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1031	597	5c683ce8-0dd5-4e87-b471-6d3f6fac1940	151	2025-08-06 13:02:00.491	\N	\N	\N	\N
793	Уборщица	40	+972-50-1032	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1032	539	a92d4f10-51aa-4403-a8b1-f1a12d2a0d45	147	2025-08-06 13:02:00.493	\N	\N	\N	\N
794	Продавец в магазин	55	+972-50-1033	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1033	522	8d8cb5b0-8762-4001-87ac-b1f1380200bc	170	2025-08-06 13:02:00.495	\N	\N	\N	\N
795	Электрик	70	+972-50-1036	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1036	601	bdf16573-6ed2-47c4-a72e-80ad97acdb16	173	2025-08-06 13:02:00.499	\N	\N	\N	\N
796	Садовник	45	+972-50-1038	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1038	536	6f06d285-3b26-439b-a178-30ba18aea48b	167	2025-08-06 13:02:00.501	\N	\N	\N	\N
797	Водитель доставки	50	+972-50-1041	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1041	597	f1dc95c3-7f51-48b4-bd14-cb9ac1420710	151	2025-08-06 13:02:00.503	\N	\N	\N	\N
798	Уборщица	40	+972-50-1042	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1042	539	37f4887b-6db0-4c29-bacb-648eb7dae16f	147	2025-08-06 13:02:00.505	\N	\N	\N	\N
799	Продавец в магазин	55	+972-50-1043	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1043	522	fd6fa884-b34d-49e9-87d6-66acbcd965b7	170	2025-08-06 13:02:00.507	\N	\N	\N	\N
800	Электрик	70	+972-50-1046	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1046	601	6ffa6680-8de1-4466-bf1c-95049067388b	173	2025-08-06 13:02:00.509	\N	\N	\N	\N
801	Садовник	45	+972-50-1048	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1048	536	0a084d9b-96ce-4bf2-a61a-53d8e3e5d937	167	2025-08-06 13:02:00.511	\N	\N	\N	\N
802	Водитель доставки	50	+972-50-1051	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1051	597	f55ecd66-83eb-4dd6-be87-d012cc9efe5b	151	2025-08-06 13:02:00.514	\N	\N	\N	\N
803	Уборщица	40	+972-50-1052	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1052	539	a4c29016-62ad-42e2-9cbf-78271135e760	147	2025-08-06 13:02:00.516	\N	\N	\N	\N
804	Продавец в магазин	55	+972-50-1053	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1053	522	a1e8a481-6482-4ade-96ca-8820343333ca	170	2025-08-06 13:02:00.518	\N	\N	\N	\N
805	Электрик	70	+972-50-1056	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1056	601	c00d669b-8d12-48bf-8fcc-5bb8808d2326	173	2025-08-06 13:02:00.525	\N	\N	\N	\N
806	Садовник	45	+972-50-1058	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1058	536	44382138-234b-44bc-a5a4-9aa2de01415a	167	2025-08-06 13:02:00.527	\N	\N	\N	\N
807	Водитель доставки	50	+972-50-1061	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1061	597	98d4949e-3eba-4255-af43-d87d5f313db7	151	2025-08-06 13:02:00.53	\N	\N	\N	\N
808	Уборщица	40	+972-50-1062	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1062	539	8c3e8d16-538e-4104-8bea-0a984f3bb59d	147	2025-08-06 13:02:00.533	\N	\N	\N	\N
809	Продавец в магазин	55	+972-50-1063	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1063	522	edf60f47-20f5-4cfb-8601-f9038695df2c	170	2025-08-06 13:02:00.534	\N	\N	\N	\N
810	Электрик	70	+972-50-1066	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1066	601	abbdf8d8-9951-48cf-afc5-74751feec285	173	2025-08-06 13:02:00.537	\N	\N	\N	\N
811	Садовник	45	+972-50-1068	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1068	536	dba8fcf1-b3ce-4004-a7ff-64253437bf5e	167	2025-08-06 13:02:00.539	\N	\N	\N	\N
812	Водитель доставки	50	+972-50-1071	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1071	597	7343f77d-29bb-41ff-a84f-2f1c650d4eca	151	2025-08-06 13:02:00.542	\N	\N	\N	\N
813	Уборщица	40	+972-50-1072	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1072	539	508eb2a9-78f8-4866-a8f2-e824f61ca21f	147	2025-08-06 13:02:00.543	\N	\N	\N	\N
814	Продавец в магазин	55	+972-50-1073	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1073	522	1f797e17-641f-4f97-af0b-3e795c7d33aa	170	2025-08-06 13:02:00.545	\N	\N	\N	\N
815	Электрик	70	+972-50-1076	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1076	601	959f7d59-3767-485e-b608-136ef1dace54	173	2025-08-06 13:02:00.548	\N	\N	\N	\N
816	Садовник	45	+972-50-1078	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1078	536	fd9174cb-be97-487d-8a71-67cbc4270440	167	2025-08-06 13:02:00.55	\N	\N	\N	\N
817	Водитель доставки	50	+972-50-1081	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1081	597	33ddb240-14da-4342-86d4-63eddaab9fb8	151	2025-08-06 13:02:00.552	\N	\N	\N	\N
818	Уборщица	40	+972-50-1082	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1082	539	ba4cd1f2-6cde-4330-859f-2574a054a6a0	147	2025-08-06 13:02:00.558	\N	\N	\N	\N
819	Продавец в магазин	55	+972-50-1083	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1083	522	9fd2268e-eccf-4101-9ba6-0fafdd5dc308	170	2025-08-06 13:02:00.56	\N	\N	\N	\N
820	Электрик	70	+972-50-1086	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1086	601	a2cc77b1-e79d-4091-a012-5e8faf6f1a17	173	2025-08-06 13:02:00.562	\N	\N	\N	\N
821	Садовник	45	+972-50-1088	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1088	536	36162ad9-fae2-402a-a46c-2fb7b20dfe2b	167	2025-08-06 13:02:00.564	\N	\N	\N	\N
822	Водитель доставки	50	+972-50-1091	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1091	597	a2cfc639-dbfe-43ae-8103-9dc3641cb1e0	151	2025-08-06 13:02:00.567	\N	\N	\N	\N
823	Уборщица	40	+972-50-1092	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1092	539	cc1c6c7c-bc8a-44f4-a545-4a61e472cbe4	147	2025-08-06 13:02:00.57	\N	\N	\N	\N
824	Продавец в магазин	55	+972-50-1093	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1093	522	0d5a2f66-3303-4540-b8f4-6172b46b5aa5	170	2025-08-06 13:02:00.573	\N	\N	\N	\N
825	Электрик	70	+972-50-1096	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1096	601	cb3094a6-a4a6-4ae1-bfeb-6148c90b6521	173	2025-08-06 13:02:00.576	\N	\N	\N	\N
826	Садовник	45	+972-50-1098	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1098	536	8f3c9b8a-f09e-432f-ba98-495fa218d6e7	167	2025-08-06 13:02:00.578	\N	\N	\N	\N
827	Водитель доставки	50	+972-50-1101	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1101	597	c2c72fe3-0042-439a-8a19-55fd6af2f0fd	151	2025-08-06 13:02:00.58	\N	\N	\N	\N
828	Уборщица	40	+972-50-1102	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1102	539	7578e44e-cf0f-49b6-88db-4a32d2ae2260	147	2025-08-06 13:02:00.583	\N	\N	\N	\N
829	Продавец в магазин	55	+972-50-1103	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1103	522	17877592-a7f5-4625-93db-c568972985df	170	2025-08-06 13:02:00.585	\N	\N	\N	\N
830	Электрик	70	+972-50-1106	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1106	601	940eecca-eb65-4f9e-aee8-35b8a9434954	173	2025-08-06 13:02:00.593	\N	\N	\N	\N
831	Садовник	45	+972-50-1108	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1108	536	96f6c11e-0c1f-463d-8acf-289adedf19d9	167	2025-08-06 13:02:00.595	\N	\N	\N	\N
832	Водитель доставки	50	+972-50-1111	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1111	597	a2fe62d3-682a-44b7-aef2-19729f90db4c	151	2025-08-06 13:02:00.598	\N	\N	\N	\N
833	Уборщица	40	+972-50-1112	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1112	539	690de9bd-ba52-44b0-a215-93144f3e3c7d	147	2025-08-06 13:02:00.599	\N	\N	\N	\N
834	Продавец в магазин	55	+972-50-1113	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1113	522	0dc654b2-b313-4d1f-9fdb-e2c32677c820	170	2025-08-06 13:02:00.602	\N	\N	\N	\N
835	Электрик	70	+972-50-1116	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1116	601	cfeff061-858e-45bf-a64c-637f16d71d08	173	2025-08-06 13:02:00.604	\N	\N	\N	\N
836	Садовник	45	+972-50-1118	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1118	536	846acb6c-87a8-42be-a98e-29585676432c	167	2025-08-06 13:02:00.607	\N	\N	\N	\N
837	Водитель доставки	50	+972-50-1121	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1121	597	a4ea8dc9-6d76-49ec-a10d-e11d31047b35	151	2025-08-06 13:02:00.609	\N	\N	\N	\N
838	Уборщица	40	+972-50-1122	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1122	539	1d61ef9a-0757-41e5-aa81-086ba550f0be	147	2025-08-06 13:02:00.61	\N	\N	\N	\N
839	Продавец в магазин	55	+972-50-1123	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1123	522	117327c7-2c05-4f3b-9b46-bb6a5858688e	170	2025-08-06 13:02:00.612	\N	\N	\N	\N
840	Электрик	70	+972-50-1126	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1126	601	88ebdecb-ed0e-4749-a36b-1249e44db0c9	173	2025-08-06 13:02:00.615	\N	\N	\N	\N
841	Садовник	45	+972-50-1128	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1128	536	faa12255-8224-415c-9d0a-218a7318082e	167	2025-08-06 13:02:00.617	\N	\N	\N	\N
842	Водитель доставки	50	+972-50-1131	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1131	597	b1f45ad4-2035-4924-b44c-ec45ddfb26f3	151	2025-08-06 13:02:00.619	\N	\N	\N	\N
843	Уборщица	40	+972-50-1132	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1132	539	72f2c575-cc5b-4e1e-a18f-80ece19acc9e	147	2025-08-06 13:02:00.621	\N	\N	\N	\N
844	Продавец в магазин	55	+972-50-1133	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1133	522	94415391-9c50-4435-947d-b97243a71057	170	2025-08-06 13:02:00.623	\N	\N	\N	\N
845	Электрик	70	+972-50-1136	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1136	601	055838f6-74fa-44c7-9e0b-8cd038256ca7	173	2025-08-06 13:02:00.626	\N	\N	\N	\N
846	Садовник	45	+972-50-1138	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1138	536	cc6d2957-58d8-4604-a92d-575565d83a8c	167	2025-08-06 13:02:00.628	\N	\N	\N	\N
847	Водитель доставки	50	+972-50-1141	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1141	597	21376424-dc97-4f26-a947-366f9250e59c	151	2025-08-06 13:02:00.63	\N	\N	\N	\N
848	Уборщица	40	+972-50-1142	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1142	539	30efe7d5-e3dc-4222-84c5-7919e527ac05	147	2025-08-06 13:02:00.632	\N	\N	\N	\N
849	Продавец в магазин	55	+972-50-1143	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1143	522	f5455747-5375-42ca-a364-a42351e57769	170	2025-08-06 13:02:00.634	\N	\N	\N	\N
850	Электрик	70	+972-50-1146	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1146	601	3af5a43b-6b95-46eb-b56b-c22c63bb44c2	173	2025-08-06 13:02:00.637	\N	\N	\N	\N
851	Садовник	45	+972-50-1148	Требуется садовник для ухода за садом. Работа 5 дней в неделю. Оплата 45 шек в час. Звоните +972-50-1148	536	ee7bd362-9f93-467e-af74-1c688145bc68	167	2025-08-06 13:02:00.639	\N	\N	\N	\N
852	Водитель доставки	50	+972-50-1151	Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-50-1151	597	cbb9738b-07e1-4855-a5b1-e376a422d44e	151	2025-08-06 13:02:00.642	\N	\N	\N	\N
853	Уборщица	40	+972-50-1152	Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-50-1152	539	23d233ef-b64e-4075-9147-846a603eee97	147	2025-08-06 13:02:00.644	\N	\N	\N	\N
854	Продавец в магазин	55	+972-50-1153	Ищу продавца в магазин одежды. Опыт работы приветствуется. Оплата 55 шек в час. +972-50-1153	522	211c6c33-3439-48e4-b0f6-d33902832717	170	2025-08-06 13:02:00.646	\N	\N	\N	\N
855	Электрик	70	+972-50-1156	Требуется электрик для работы в жилых домах. Лицензия обязательна. Оплата 70 шек в час. Звоните +972-50-1156	601	695ad295-a7d3-47f6-8cc9-b123829e6809	173	2025-08-06 13:02:00.648	\N	\N	\N	\N
856	Работа на складе – сбор заказов	42	0539612730	📦 Работа на складе – сбор заказов\n\n⭐ Что нужно делать:\n🔹 Пробивать заказы сканером и относить в зоны, указанные на экране\n🔹 Заматывать палеты с коробками плёнкой\n🔹 Поднимать и раскладывать небольшие коробки на полки\n\n💰 Зарплата: 42 шекеля/час\n⏰ График: с 8:00 до 17:00\n🚐 Подвозка: с юга/центра\n👍 Хорошие условия трудоустройства\n💵 Выплаты: каждую неделю\n\n📲 Пишите в WhatsApp: 053-961-2730	514	352798b0-3f1a-4b4a-9aa1-e8d66255a36a	164	2025-08-06 13:19:22.616	2025-08-12 09:06:48.106	f	t	https://my-app-ads-images.s3.eu-north-1.amazonaws.com/jobs/6e631f67-ea01-4a13-92fb-1dcbe04ac655.png
858	dasdadsada	55	05313423131	asdqwdwjhqiorfjqior142	516	93eaaf28-0bc0-4628-a814-6ea042f0ef44	148	2025-09-03 16:57:27.899	\N	t	t	\N
859	qjneqjwejqejqejhq	44	0539612730	qwejhqeiugruygquyewh	513	7da318cd-a40d-48df-ad30-b6e96978c9b8	149	2025-09-13 08:50:57.42	\N	f	t	\N
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, "clerkUserId", title, body, "isRead", type, "fromAdminId", "createdAt") FROM stdin;
25574226-9e2e-4f92-bc6d-d5975aa080d9	user_2t5vI9cGkwQ1BS0XmaBX2nJLvSe	Спасибо за покупку Pro подписки на WorkNow!	Здравствуйте!<br><br>\n          Спасибо, что приобрели Pro подписку на WorkNow.<br>\n          Ваша подписка активирована.<br>\n          <b>Чек об оплате был отправлен на ваш электронный адрес.</b><br><br>\n          Если у вас возникнут вопросы — пишите в поддержку!	t	system	\N	2025-08-16 12:36:09.36
abffe9b1-8166-4c31-a4fd-4faf6d0330ed	user_2t5vI9cGkwQ1BS0XmaBX2nJLvSe	Добро пожаловать в Premium Deluxe!	Для активации функции автопостинга напишите вашему персональному менеджеру: <a href="mailto:peterbaikov12@gmail.com">peterbaikov12@gmail.com</a>	t	system	\N	2025-08-03 07:31:10.619
783241c1-452b-4583-9c3e-3616fa28af14	user_2t5vI9cGkwQ1BS0XmaBX2nJLvSe	Спасибо за покупку Pro подписки на WorkNow!	Здравствуйте!<br><br>\n          Спасибо, что приобрели Pro подписку на WorkNow.<br>\n          Ваша подписка активирована.<br>\n          <b>Чек об оплате был отправлен на ваш электронный адрес.</b><br><br>\n          Если у вас возникнут вопросы — пишите в поддержку!	t	system	\N	2025-08-06 14:10:35.358
75a447ab-aaf9-4f37-8b16-e48b86378c9d	user_2t5vI9cGkwQ1BS0XmaBX2nJLvSe	Спасибо за покупку Pro подписки на WorkNow!	Здравствуйте!<br><br>\n          Спасибо, что приобрели Pro подписку на WorkNow.<br>\n          Ваша подписка активирована.<br>\n          <b>Чек об оплате был отправлен на ваш электронный адрес.</b><br><br>\n          Если у вас возникнут вопросы — пишите в поддержку!	t	system	\N	2025-08-06 14:19:31.37
0d689ae5-f80f-4e1e-86fd-fc057a70a3b8	user_2t5vI9cGkwQ1BS0XmaBX2nJLvSe	Добро пожаловать в Premium Deluxe!	Для активации функции автопостинга напишите вашему персональному менеджеру: <a href="mailto:peterbaikov12@gmail.com">peterbaikov12@gmail.com</a>	t	system	\N	2025-08-06 14:20:37.473
\.


--
-- Data for Name: NewsletterSubscriber; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NewsletterSubscriber" (id, email, "firstName", "lastName", "isActive", "createdAt", "updatedAt", language, preferences, "onlyDemanded", "preferredCategories", "preferredCities", "preferredDocumentTypes", "preferredEmployment", "preferredGender", "preferredLanguages") FROM stdin;
2	test@example.com	Test	User	f	2025-07-31 14:56:52.058	2025-07-31 14:58:21.81	ru	{}	f	{}	{}	{}	{}	\N	{}
3	fresh@example.com	Test	User	f	2025-07-31 14:58:40.548	2025-07-31 15:03:31.525	ru	{}	f	{}	{}	{}	{}	\N	{}
4	newtest@example.com	Test	User	f	2025-07-31 15:03:45.808	2025-07-31 15:03:45.871	ru	{}	f	{}	{}	{}	{}	\N	{}
5	uitest@example.com	UI	Test	f	2025-07-31 15:04:55.342	2025-07-31 15:04:55.361	ru	{}	f	{}	{}	{}	{}	\N	{}
\.


--
-- Data for Name: NewsletterVerification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NewsletterVerification" (id, email, code, "expiresAt", attempts, "createdAt") FROM stdin;
1	completelynew@example.com	639566	2025-08-03 10:26:25.053	0	2025-08-03 10:16:25.066
2	testverification@example.com	974626	2025-08-03 10:27:38.956	0	2025-08-03 10:17:38.965
3	debugtest@example.com	396657	2025-08-03 10:30:11.883	0	2025-08-03 10:18:36.861
14	verificationtest@example.com	244764	2025-08-03 19:18:00.485	0	2025-08-03 19:08:00.486
15	debugsns@example.com	123456	2025-08-04 05:05:03.414	0	2025-08-04 04:55:03.528
16	frontendtest@example.com	743491	2025-08-04 05:05:24.045	0	2025-08-04 04:55:24.048
17	serverlogstest@example.com	752773	2025-08-04 05:06:36.721	0	2025-08-04 04:55:58.082
19	emailsendingtest@example.com	410049	2025-08-04 05:07:07.163	0	2025-08-04 04:57:07.164
29	worknow.notifications@gmail.com	738573	2025-09-08 14:50:22.271	0	2025-08-28 13:34:17.03
33	peterbaikov12@gmail.com	829533	2025-09-13 16:18:59.267	0	2025-09-13 16:08:59.401
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, "clerkUserId", month, amount, type, date) FROM stdin;
\.


--
-- Data for Name: Seeker; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Seeker" (id, name, contact, city, description, slug, "isActive", "isDemanded", "createdAt", gender, facebook, languages, "nativeLanguage", employment, category, documents, note, announcement, "documentType") FROM stdin;
31	Дмитрий	0524612251	Хайфа	Ищу трудоустройство в технической сфере. 	дмитрий-ищу-трудоустройство-в-технической-сфере	t	f	2025-08-14 14:46:00.322	мужчина		{русский}	русский	полная	Связь-телекоммуникации		Богатый опыт работы с различными компьютерными системами, сетями и т.д. 	Ищу трудоустройство в технической сфере. 	Теудат Зеут
32	Виталий	0559902471	Ашдод	Ищу работу в Ашдоде, тех навыки, работал механиком, опыт работы в ремонте квартир. 	виталий-ищу-работу-в-ашдоде-тех-навыки-работал-механиком-опыт-работы-в-ремонте-квартир	t	f	2025-08-14 14:48:02.693	мужчина		{русский,иврит}	русский	полная	Завод		 40 лет	Ищу работу в Ашдоде, тех навыки, работал механиком, опыт работы в ремонте квартир. 	Теудат Зеут
33	Александр	0503399058	Центр страны	 Ищу работу в сфере пищевое производство/контроль качества 	александр-ищу-работу-в-сфере-пищевое-производство-контроль-качества	t	f	2025-08-14 14:56:33.296	мужчина		{русский,английский,иврит}	русский	полная	Общепит			 Ищу работу в сфере пищевое производство/контроль качества 	Теудат Зеут
34	Данил	0507330586	Иерусалим	 Ищу работу, рассмотрю варианты. 	данил-ищу-работу-рассмотрю-варианты	t	f	2025-08-14 15:01:53.024	мужчина		{русский}	русский	полная	Разное			 Ищу работу, рассмотрю варианты. 	Теудат Зеут
35	Виктория	 0538073799	Хайфа	 Ищу подработку, уборку. Офисы. 	виктория-ищу-подработку-уборку-офисы	t	f	2025-08-15 07:20:52.213	женщина		{русский}	русский	частичная	Уборка		Предложения от 45 шек/час	 Ищу подработку, уборку. Офисы. 	Теудат Зеут
36	Марат	 0504642919	Ашдод	 Ищу работу в ночную смену. 	марат-ищу-работу-в-ночную-смену	t	t	2025-08-15 07:22:57.132	мужчина		{русский,иврит}	русский	полная	Склад		 62 года. Вод.права + на погрузчик. Опыт в обеих сферах 	 Ищу работу в ночную смену. 	Теудат Зеут
37	Татьяна	 0556844924	Центр страны	 Ищу работу по спецвизе 188%. 	татьяна-ищу-работу-по-спецвизе-188	t	f	2025-08-15 07:24:31.148	женщина		{русский,иврит}	русский	полная	Уход за пожилыми		 В Израиле 5 лет, желательно Ришон или рядом. 	 Ищу работу по спецвизе 188%. 	Рабочая виза
38	Феликс	 0507760605	Юг страны	 Ищу подработку. Есть опыт работы на кухне, права до 15 тонн. 	феликс-ищу-подработку-есть-опыт-работы-на-кухне-права-до-15-тонн	t	f	2025-08-15 07:31:05.124	мужчина		{русский}	русский	частичная	Общепит			 Ищу подработку. Есть опыт работы на кухне, права до 15 тонн. Права на транспорт	Другое
39	Амир	0539725025	Иерусалим	 Ищу работу на производстве. 	амир-ищу-работу-на-производстве	t	f	2025-08-15 07:33:33.529	мужчина		{русский,английский,иврит}	русский	полная	Завод		 Окончил бакалавриат и магистратура по специальности энергетическое машиностроения и механика. 	 Ищу работу на производстве. 	Теудат Зеут
40	Ксения	 0533064708	Хайфа	 Ищу работу на начальных административных позициях с возможностью развития 	ксения-ищу-работу-на-начальных-административных-позициях-с-возможностью-развития	t	f	2025-08-15 07:36:33.7	женщина	kseniyalerman@gmail.com 	{русский,иврит}	русский	полная	Офис			 Ищу работу на начальных административных позициях с возможностью развития 	Теудат Зеут
41	Светлана	 0532468474	Акко	 Ищу работу на производстве (электроника и т.д.). Без ночных смен. 	светлана-ищу-работу-на-производстве-электроника-и-т-д-без-ночных-смен	t	f	2025-08-15 07:38:30.941	женщина		{русский,иврит}	русский	полная	Завод		 Зарплата от 37 шекелей в час. Опыт 3 года. 	 Ищу работу на производстве (электроника и т.д.). Без ночных смен. 	Теудат Зеут
42	Анна	0507194541	Центр страны	 Ищу работу в сфере бухгалтерии 	анна-ищу-работу-в-сфере-бухгалтерии	t	f	2025-08-15 07:39:50.223	женщина		{русский,иврит}	русский	полная	Офис		 Закончила курсы в Израиле. Живу в Петах Тикве. 	 Ищу работу в сфере бухгалтерии 	Теудат Зеут
43	Наталья	 0585505211	Центр страны	 Ищу работу в сфере пайка, хивут 	наталья-ищу-работу-в-сфере-пайка-хивут	t	t	2025-08-15 07:41:02.471	женщина		{русский,иврит}	русский	полная	Завод			 Ищу работу в сфере пайка, хивут 	Теудат Зеут
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, "createdAt", "updatedAt", "clerkUserId", "firstName", "imageUrl", "isAutoRenewal", "isPremium", "lastName", "premiumEndsAt", "stripeSubscriptionId", "premiumDeluxe", "isAdmin") FROM stdin;
63931fac-806c-4588-8aba-417ddca0ef4e	Bazhen.Silina@yandex.ru	2025-08-06 13:02:00.351	2025-08-06 13:02:00.351	user_90c60dbb-ed95-461e-b780-d7eda9a2f601	Бажен	https://ui-avatars.com/api/?name=%D0%91%D0%A1&background=random&color=fff&size=128	t	f	Силина	\N	\N	f	f
a53d946b-4e90-42a0-b2d2-7630974b8e89	Khana.Kharitonova@yandex.ru	2025-08-06 13:02:00.371	2025-08-06 13:02:00.371	user_cbdd1cef-7e95-43be-9f02-0d2083944b22	Хана	https://ui-avatars.com/api/?name=%D0%A5%D0%A5&background=random&color=fff&size=128	t	f	Харитонова	\N	\N	f	f
f5328884-48d3-489b-8f7c-8b891cea1e83	Afanasii.Lukin@gmail.com	2025-08-06 13:02:00.374	2025-08-06 13:02:00.374	user_6a593db9-b865-4fb1-a18b-e447d87d719c	Афанасий	https://ui-avatars.com/api/?name=%D0%90%D0%9B&background=random&color=fff&size=128	t	f	Лукин	\N	\N	f	f
cbcc4eec-dd57-4486-9b0c-9efc017ca2c2	Onufrii.Baranov27@yandex.ru	2025-08-06 13:02:00.377	2025-08-06 13:02:00.377	user_9587ae29-7ddf-4416-839b-b59b637bbeff	Онуфрий	https://ui-avatars.com/api/?name=%D0%9E%D0%91&background=random&color=fff&size=128	t	f	Баранов	\N	\N	f	f
50acb0b2-9467-4ed4-b290-fc50a297f9f7	Evpraksiya.Kozlova10@mail.ru	2025-08-06 13:02:00.38	2025-08-06 13:02:00.38	user_403c1437-72a2-413c-9919-0a48df4d3c87	Евпраксия	https://ui-avatars.com/api/?name=%D0%95%D0%9A&background=random&color=fff&size=128	t	f	Козлова	\N	\N	f	f
91326ca3-5d0e-4982-88bf-8812dd5330c2	Iraklii.Yudin85@hotmail.com	2025-08-06 13:02:00.382	2025-08-06 13:02:00.382	user_7353a389-cb66-459c-8b40-c9429ff04457	Ираклий	https://ui-avatars.com/api/?name=%D0%98%D0%AE&background=random&color=fff&size=128	t	f	Юдин	\N	\N	f	f
3dff2094-fcc8-4c3f-aa1a-9ee7b72ba45c	Shimon_Terentukeva@ya.ru	2025-08-06 13:02:00.384	2025-08-06 13:02:00.384	user_895293bb-e484-45d4-a719-e880f4100408	Шимон	https://ui-avatars.com/api/?name=%D0%A8%D0%A2&background=random&color=fff&size=128	t	f	Терентьева	\N	\N	f	f
e36fb991-2857-477a-9b38-d687411a1ed9	Menakhem_Timofeev4@ya.ru	2025-08-06 13:02:00.386	2025-08-06 13:02:00.386	user_6033c307-34da-4acc-9203-0e64db43fb5d	Менахем	https://ui-avatars.com/api/?name=%D0%9C%D0%A2&background=random&color=fff&size=128	t	f	Тимофеев	\N	\N	f	f
0edaef2d-4013-4e98-84db-d61601c1a6e6	Viktor_Komissarova94@mail.ru	2025-08-06 13:02:00.389	2025-08-06 13:02:00.389	user_80c59792-3a98-4f1a-b4a8-05c915fdbcb5	Виктор	https://ui-avatars.com/api/?name=%D0%92%D0%9A&background=random&color=fff&size=128	t	f	Комиссарова	\N	\N	f	f
7180c501-091d-4e9e-bd2c-dc84428361b8	Batsheva_Vorobukev@yahoo.com	2025-08-06 13:02:00.391	2025-08-06 13:02:00.391	user_d370fbc7-b41a-44aa-875b-66c7934e4341	Батшева	https://ui-avatars.com/api/?name=%D0%91%D0%92&background=random&color=fff&size=128	t	f	Воробьев	\N	\N	f	f
f117ea05-147c-41d2-8b15-f2dcf8686e1e	Nikodim_Suvorov@yahoo.com	2025-08-06 13:02:00.395	2025-08-06 13:02:00.395	user_ac0c20d4-7636-4b9b-adc6-755a87d0eff9	Никодим	https://ui-avatars.com/api/?name=%D0%9D%D0%A1&background=random&color=fff&size=128	t	f	Суворов	\N	\N	f	f
77bcbcfc-95f6-46bc-a592-7c5e29a0a586	Tamar_Orlov10@gmail.com	2025-08-06 13:02:00.397	2025-08-06 13:02:00.397	user_e0c923bb-f723-4216-9646-e993d74abf9b	Тамар	https://ui-avatars.com/api/?name=%D0%A2%D0%9E&background=random&color=fff&size=128	t	f	Орлов	\N	\N	f	f
14ae09cd-7125-4a2d-8c4f-0fb4eb36c4bb	Shimon.Terentukev76@yandex.ru	2025-08-06 13:02:00.4	2025-08-06 13:02:00.4	user_40eabb1e-29c3-4178-89a8-d5e9509ef509	Шимон	https://ui-avatars.com/api/?name=%D0%A8%D0%A2&background=random&color=fff&size=128	t	f	Терентьев	\N	\N	f	f
363a06ca-33f5-4f4b-a992-8acadcd07df5	Ada_Kopylova14@yahoo.com	2025-08-06 13:02:00.401	2025-08-06 13:02:00.401	user_85ac4f3b-e1be-487b-bbf7-6d9b3f76274f	Ада	https://ui-avatars.com/api/?name=%D0%90%D0%9A&background=random&color=fff&size=128	t	f	Копылова	\N	\N	f	f
5c3d20b6-e4b5-4b6b-9b8d-8cb82c1f5901	Arkhip.Evseev@mail.ru	2025-08-06 13:02:00.403	2025-08-06 13:02:00.403	user_afdadaf9-c24d-4dad-8abc-5af26ebb3f3e	Архип	https://ui-avatars.com/api/?name=%D0%90%D0%95&background=random&color=fff&size=128	t	f	Евсеев	\N	\N	f	f
3f73b96f-9e72-4529-a566-2e2c15cac862	Andrei.Ermakova79@yahoo.com	2025-08-06 13:02:00.404	2025-08-06 13:02:00.404	user_5c8f1a73-79f7-4463-aa59-7d17a45127f4	Андрей	https://ui-avatars.com/api/?name=%D0%90%D0%95&background=random&color=fff&size=128	t	f	Ермакова	\N	\N	f	f
d5d311ed-0556-4f61-8aa5-5f93db806cf0	Kim.Zhuravlev@hotmail.com	2025-08-06 13:02:00.406	2025-08-06 13:02:00.406	user_d906747f-7344-47e6-83ce-5d513ff97dd2	Ким	https://ui-avatars.com/api/?name=%D0%9A%D0%96&background=random&color=fff&size=128	t	f	Журавлев	\N	\N	f	f
936c831a-1593-4f9f-9833-f150696aac87	Ostap.Kovalev@mail.ru	2025-08-06 13:02:00.408	2025-08-06 13:02:00.408	user_96b4800d-8bea-4714-bceb-ded1c350a270	Остап	https://ui-avatars.com/api/?name=%D0%9E%D0%9A&background=random&color=fff&size=128	t	f	Ковалев	\N	\N	f	f
ed9fc101-9200-479e-b015-22d0d0156a84	Tamar.Kirillova9@yandex.ru	2025-08-06 13:02:00.41	2025-08-06 13:02:00.41	user_f45ae652-5efb-442f-ab3e-47533bc0a4f6	Тамар	https://ui-avatars.com/api/?name=%D0%A2%D0%9A&background=random&color=fff&size=128	t	f	Кириллова	\N	\N	f	f
d4ebb75f-5583-4a40-9573-2c7cbc6f6e09	Florentin_Kolesnikov70@gmail.com	2025-08-06 13:02:00.412	2025-08-06 13:02:00.412	user_5bb7462e-1504-4b13-ac3a-6e34b993a600	Флорентин	https://ui-avatars.com/api/?name=%D0%A4%D0%9A&background=random&color=fff&size=128	t	f	Колесников	\N	\N	f	f
682e41c1-3c35-44c3-bea2-aa8ce3a9cf31	Ester.Rybakov88@yandex.ru	2025-08-06 13:02:00.414	2025-08-06 13:02:00.414	user_c18649de-69b9-404b-bb9a-770de4043099	Эстер	https://ui-avatars.com/api/?name=%D0%AD%D0%A0&background=random&color=fff&size=128	t	f	Рыбаков	\N	\N	f	f
d138522d-6c57-4547-97fd-a2da648ea815	Izyaslav_Eliseev@ya.ru	2025-08-06 13:02:00.416	2025-08-06 13:02:00.416	user_a7cdd4b3-baa3-435f-850c-2067cbcc7d27	Изяслав	https://ui-avatars.com/api/?name=%D0%98%D0%95&background=random&color=fff&size=128	t	f	Елисеев	\N	\N	f	f
9daf9379-f5d6-46a5-b985-97c248bea07e	Yakov.Kotova@hotmail.com	2025-08-06 13:02:00.417	2025-08-06 13:02:00.417	user_275d682c-3930-4ffe-b65f-038669252b7d	Яков	https://ui-avatars.com/api/?name=%D0%AF%D0%9A&background=random&color=fff&size=128	t	f	Котова	\N	\N	f	f
77f9feb6-53c5-4fbd-bea7-baad38ecf6f7	Ryurik.Molchanov@yahoo.com	2025-08-06 13:02:00.419	2025-08-06 13:02:00.419	user_27fed50c-0c06-4e19-9a45-0346513ffc8f	Рюрик	https://ui-avatars.com/api/?name=%D0%A0%D0%9C&background=random&color=fff&size=128	t	f	Молчанов	\N	\N	f	f
1c4b9ed8-ac76-4cec-8442-61a0f5e9ede0	Fortunat.Maksimov@hotmail.com	2025-08-06 13:02:00.42	2025-08-06 13:02:00.42	user_8bc86184-e2ab-4610-9e33-57743db1ca4a	Фортунат	https://ui-avatars.com/api/?name=%D0%A4%D0%9C&background=random&color=fff&size=128	t	f	Максимов	\N	\N	f	f
1197c305-64d7-401e-a89d-2c76b81b333f	Rakheluk_Davydova17@yahoo.com	2025-08-06 13:02:00.422	2025-08-06 13:02:00.422	user_b38d8c7a-f074-42df-bdff-92a80bd4f4ff	Рахель	https://ui-avatars.com/api/?name=%D0%A0%D0%94&background=random&color=fff&size=128	t	f	Давыдова	\N	\N	f	f
0b3ce87b-51ae-45a2-ba48-738867d578ba	Leya_Krasiluknikova52@ya.ru	2025-08-06 13:02:00.424	2025-08-06 13:02:00.424	user_e3933caa-4e34-4a5c-9f19-345e71e89934	Лея	https://ui-avatars.com/api/?name=%D0%9B%D0%9A&background=random&color=fff&size=128	t	f	Красильникова	\N	\N	f	f
97c7bfa4-20cf-4e64-a9a0-3a6a53c715c7	Ester.Nikolaev@mail.ru	2025-08-06 13:02:00.426	2025-08-06 13:02:00.426	user_01a355fe-6b79-471f-81e4-12a8a270a655	Эстер	https://ui-avatars.com/api/?name=%D0%AD%D0%9D&background=random&color=fff&size=128	t	f	Николаев	\N	\N	f	f
cea1d9bf-c909-4e23-b32f-92cba03b831c	Ester.Kolesnikov@yahoo.com	2025-08-06 13:02:00.428	2025-08-06 13:02:00.428	user_95e87b7e-7c51-4be6-ab07-0f5fe234fc28	Эстер	https://ui-avatars.com/api/?name=%D0%AD%D0%9A&background=random&color=fff&size=128	t	f	Колесников	\N	\N	f	f
a0b1beeb-1ee8-4940-b44d-0a33c1319a67	Shlomo.Lytkina91@yandex.ru	2025-08-06 13:02:00.43	2025-08-06 13:02:00.43	user_85f6bdfa-2e12-40f9-b155-4fed0f43f5a5	Шломо	https://ui-avatars.com/api/?name=%D0%A8%D0%9B&background=random&color=fff&size=128	t	f	Лыткина	\N	\N	f	f
ce4714c9-ab8f-400a-bbe7-4f7207a5b201	Ernst.Orlov@yahoo.com	2025-08-06 13:02:00.431	2025-08-06 13:02:00.431	user_b79ea0cb-7f3f-4083-97d4-3ce18e3b92f7	Эрнст	https://ui-avatars.com/api/?name=%D0%AD%D0%9E&background=random&color=fff&size=128	t	f	Орлов	\N	\N	f	f
640fac74-c82e-4439-8549-d6d318f3a2ae	Gedeon.Abramova88@ya.ru	2025-08-06 13:02:00.433	2025-08-06 13:02:00.433	user_259c826f-902d-4abc-bd0c-369ca69e4f82	Гедеон	https://ui-avatars.com/api/?name=%D0%93%D0%90&background=random&color=fff&size=128	t	f	Абрамова	\N	\N	f	f
fdec40d5-b46e-483e-b7f8-6d6100c7548b	Ostap.Lebedeva72@mail.ru	2025-08-06 13:02:00.435	2025-08-06 13:02:00.435	user_1e971942-e8ff-48c8-96ec-e86c65431b4b	Остап	https://ui-avatars.com/api/?name=%D0%9E%D0%9B&background=random&color=fff&size=128	t	f	Лебедева	\N	\N	f	f
6c9a1b0a-45aa-48c7-8d27-b66fbfbdccd5	Sara.Shestakova49@yandex.ru	2025-08-06 13:02:00.438	2025-08-06 13:02:00.438	user_5ec16685-5380-43a8-a261-9d42642db8b6	Сара	https://ui-avatars.com/api/?name=%D0%A1%D0%A8&background=random&color=fff&size=128	t	f	Шестакова	\N	\N	f	f
55b3ed9b-c462-4045-b34d-27511b0ba060	Sara.Shilov23@hotmail.com	2025-08-06 13:02:00.439	2025-08-06 13:02:00.439	user_2e27cf0f-31f4-499b-852f-94ce7b4ef95f	Сара	https://ui-avatars.com/api/?name=%D0%A1%D0%A8&background=random&color=fff&size=128	t	f	Шилов	\N	\N	f	f
426a52e9-0a2c-4af5-8ccb-000d6fe535c7	Batsheva_Abramova@yahoo.com	2025-08-06 13:02:00.441	2025-08-06 13:02:00.441	user_79b1fe5f-93f7-4b9f-b522-441dde3012c2	Батшева	https://ui-avatars.com/api/?name=%D0%91%D0%90&background=random&color=fff&size=128	t	f	Абрамова	\N	\N	f	f
2cbe1df5-e71f-4b65-85d6-bf21258dab60	Praskovukya_Kopylova@yahoo.com	2025-08-06 13:02:00.443	2025-08-06 13:02:00.443	user_349d00b9-cdfb-4d73-a672-eb9cf4f5fb2a	Прасковья	https://ui-avatars.com/api/?name=%D0%9F%D0%9A&background=random&color=fff&size=128	t	f	Копылова	\N	\N	f	f
d5277f3d-7180-4a8e-a6db-6cd98c429c10	Itskhak_Kozlov@yandex.ru	2025-08-06 13:02:00.444	2025-08-06 13:02:00.444	user_1fdee9be-b2b6-4701-9f24-7cee7767322f	Ицхак	https://ui-avatars.com/api/?name=%D0%98%D0%9A&background=random&color=fff&size=128	t	f	Козлов	\N	\N	f	f
663dd893-9249-471d-85f4-eab6685bbdfb	Eliezer_Lebedeva@mail.ru	2025-08-06 13:02:00.446	2025-08-06 13:02:00.446	user_3e75872e-3136-476d-a9c7-e49dcdce65bb	Элиэзер	https://ui-avatars.com/api/?name=%D0%AD%D0%9B&background=random&color=fff&size=128	t	f	Лебедева	\N	\N	f	f
a138ea21-c33a-4aa2-a7c7-2ec9704a0cd7	Miriam_Yudin@yahoo.com	2025-08-06 13:02:00.448	2025-08-06 13:02:00.448	user_99e53d59-ab78-4573-9cce-2b7b4fa4c85a	Мириам	https://ui-avatars.com/api/?name=%D0%9C%D0%AE&background=random&color=fff&size=128	t	f	Юдин	\N	\N	f	f
fe36fa41-01a3-48c7-a7ca-1c41f4803dec	Leya_Mironova93@mail.ru	2025-08-06 13:02:00.45	2025-08-06 13:02:00.45	user_a0ca6cfd-2ff3-41fc-aaa0-9f0814a7d7c8	Лея	https://ui-avatars.com/api/?name=%D0%9B%D0%9C&background=random&color=fff&size=128	t	f	Миронова	\N	\N	f	f
cad9f96f-bb7d-4c0d-a5f7-425578ec39ee	Leya.Samoilov@ya.ru	2025-08-06 13:02:00.452	2025-08-06 13:02:00.452	user_9080b463-51ca-4bd2-8d2b-9adbfe9fd326	Лея	https://ui-avatars.com/api/?name=%D0%9B%D0%A1&background=random&color=fff&size=128	t	f	Самойлов	\N	\N	f	f
5e737f31-6faa-4b66-adb3-b0c8fe7d4085	David_Moiseev@yahoo.com	2025-08-06 13:02:00.454	2025-08-06 13:02:00.454	user_4e33a811-c775-48ec-9c32-6d229a04d05f	Давид	https://ui-avatars.com/api/?name=%D0%94%D0%9C&background=random&color=fff&size=128	t	f	Моисеев	\N	\N	f	f
cf049d41-ac16-4f9a-ba31-886dc9ffd8a8	Shlomo.Lazareva64@mail.ru	2025-08-06 13:02:00.456	2025-08-06 13:02:00.456	user_863f1582-5d9d-43ff-94ed-6684ccd9273d	Шломо	https://ui-avatars.com/api/?name=%D0%A8%D0%9B&background=random&color=fff&size=128	t	f	Лазарева	\N	\N	f	f
3403362f-8977-4088-8e84-79f0cdfca2dd	Ester.Romanova95@yandex.ru	2025-08-06 13:02:00.458	2025-08-06 13:02:00.458	user_595b8ac9-e13e-4963-8cf5-692eba64b0e5	Эстер	https://ui-avatars.com/api/?name=%D0%AD%D0%A0&background=random&color=fff&size=128	t	f	Романова	\N	\N	f	f
8c31af40-54fa-463c-a77d-15b5714b0d50	Shimon_Zhuravleva@yahoo.com	2025-08-06 13:02:00.461	2025-08-06 13:02:00.461	user_7b8a6de4-3f46-4124-8f15-19bea9c4f56a	Шимон	https://ui-avatars.com/api/?name=%D0%A8%D0%96&background=random&color=fff&size=128	t	f	Журавлева	\N	\N	f	f
dd2d1741-5059-4039-a8ab-3903d057af71	Konon_Blinov56@gmail.com	2025-08-06 13:02:00.463	2025-08-06 13:02:00.463	user_9c946b94-78a5-451c-9ded-b0ca709e8c95	Конон	https://ui-avatars.com/api/?name=%D0%9A%D0%91&background=random&color=fff&size=128	t	f	Блинов	\N	\N	f	f
f098f6c3-e713-4095-bdb0-3d5ab64dbb5f	Shimon_Kalashnikov@yahoo.com	2025-08-06 13:02:00.466	2025-08-06 13:02:00.466	user_ef63a20f-99ab-42ca-8c22-c3f0d4949697	Шимон	https://ui-avatars.com/api/?name=%D0%A8%D0%9A&background=random&color=fff&size=128	t	f	Калашников	\N	\N	f	f
7c2354bd-b7f5-491b-a996-618c7586b86a	Rakheluk_Rogova@ya.ru	2025-08-06 13:02:00.468	2025-08-06 13:02:00.468	user_c65c4d8b-c8e9-4e16-9904-0f6c5b52a9ee	Рахель	https://ui-avatars.com/api/?name=%D0%A0%D0%A0&background=random&color=fff&size=128	t	f	Рогова	\N	\N	f	f
79f99e20-d91a-4dbb-ac74-63b3380d14a8	Miriam.Moiseeva83@gmail.com	2025-08-06 13:02:00.471	2025-08-06 13:02:00.471	user_dbb75ff1-3f7b-4a64-9d5b-8d8cf8fd4142	Мириам	https://ui-avatars.com/api/?name=%D0%9C%D0%9C&background=random&color=fff&size=128	t	f	Моисеева	\N	\N	f	f
c21f439c-11af-4d38-9bf0-7f867694b28d	Luchezar.Lebedev10@mail.ru	2025-08-06 13:02:00.473	2025-08-06 13:02:00.473	user_a37a9158-2178-4ae8-8019-189029febbaa	Лучезар	https://ui-avatars.com/api/?name=%D0%9B%D0%9B&background=random&color=fff&size=128	t	f	Лебедев	\N	\N	f	f
a06c1d1e-1339-4c1f-bdce-7f0fa83469a8	Fotii.Molchanov@gmail.com	2025-08-06 13:02:00.476	2025-08-06 13:02:00.476	user_df62c6c3-1b87-4e6d-9c9f-492a91125b3c	Фотий	https://ui-avatars.com/api/?name=%D0%A4%D0%9C&background=random&color=fff&size=128	t	f	Молчанов	\N	\N	f	f
5a2187b9-8d35-41bf-8020-609779e11824	Khana_Filippova@ya.ru	2025-08-06 13:02:00.479	2025-08-06 13:02:00.479	user_1f605d0f-6ae0-4fd8-bcac-f45e6fefddbe	Хана	https://ui-avatars.com/api/?name=%D0%A5%D0%A4&background=random&color=fff&size=128	t	f	Филиппова	\N	\N	f	f
8bb2046c-a640-4553-a839-7ec402058329	Avraam.Potapova47@mail.ru	2025-08-06 13:02:00.481	2025-08-06 13:02:00.481	user_bfcf087e-6a68-4239-a73f-59bf5abd2a11	Авраам	https://ui-avatars.com/api/?name=%D0%90%D0%9F&background=random&color=fff&size=128	t	f	Потапова	\N	\N	f	f
1fe0d288-85ec-479a-96a8-6c6bb43d8b53	Moshe.Kozlova@yahoo.com	2025-08-06 13:02:00.483	2025-08-06 13:02:00.483	user_c0b72e16-8003-4a1c-a776-0b34c1b1e9e9	Моше	https://ui-avatars.com/api/?name=%D0%9C%D0%9A&background=random&color=fff&size=128	t	f	Козлова	\N	\N	f	f
c290b606-e3f5-4b49-b750-af470d372ff9	Leya.Panov@hotmail.com	2025-08-06 13:02:00.486	2025-08-06 13:02:00.486	user_90fd662a-0396-40c3-9a7f-0a318b8d9ab7	Лея	https://ui-avatars.com/api/?name=%D0%9B%D0%9F&background=random&color=fff&size=128	t	f	Панов	\N	\N	f	f
b1857af7-7004-4f86-9134-153a908a979a	Miriam.Rogov4@ya.ru	2025-08-06 13:02:00.488	2025-08-06 13:02:00.488	user_84bf629e-9741-4cb9-8c02-a1902baa1fa0	Мириам	https://ui-avatars.com/api/?name=%D0%9C%D0%A0&background=random&color=fff&size=128	t	f	Рогов	\N	\N	f	f
5c683ce8-0dd5-4e87-b471-6d3f6fac1940	Tamara_Zhdanov27@mail.ru	2025-08-06 13:02:00.491	2025-08-06 13:02:00.491	user_a4d63c86-fff1-4bcf-b05b-9a670361a0f3	Тамара	https://ui-avatars.com/api/?name=%D0%A2%D0%96&background=random&color=fff&size=128	t	f	Жданов	\N	\N	f	f
a92d4f10-51aa-4403-a8b1-f1a12d2a0d45	Evgraf.Mironov@hotmail.com	2025-08-06 13:02:00.493	2025-08-06 13:02:00.493	user_086fe6ed-1fd7-40b4-8e58-27ff777d8903	Евграф	https://ui-avatars.com/api/?name=%D0%95%D0%9C&background=random&color=fff&size=128	t	f	Миронов	\N	\N	f	f
8d8cb5b0-8762-4001-87ac-b1f1380200bc	Oktyabrina_Zinovukev@ya.ru	2025-08-06 13:02:00.495	2025-08-06 13:02:00.495	user_2e7dd8e9-c3f9-4a4e-bf1f-7458e208c25c	Октябрина	https://ui-avatars.com/api/?name=%D0%9E%D0%97&background=random&color=fff&size=128	t	f	Зиновьев	\N	\N	f	f
bdf16573-6ed2-47c4-a72e-80ad97acdb16	Evgenii_Medvedeva@ya.ru	2025-08-06 13:02:00.499	2025-08-06 13:02:00.499	user_eabf030b-e46c-4e3a-a043-f72edade5bf2	Евгений	https://ui-avatars.com/api/?name=%D0%95%D0%9C&background=random&color=fff&size=128	t	f	Медведева	\N	\N	f	f
6f06d285-3b26-439b-a178-30ba18aea48b	Batsheva_Sitnikov9@yahoo.com	2025-08-06 13:02:00.501	2025-08-06 13:02:00.501	user_151e87be-44f0-430e-9df3-3021711f3cf1	Батшева	https://ui-avatars.com/api/?name=%D0%91%D0%A1&background=random&color=fff&size=128	t	f	Ситников	\N	\N	f	f
f1dc95c3-7f51-48b4-bd14-cb9ac1420710	Rakheluk_Likhacheva@mail.ru	2025-08-06 13:02:00.503	2025-08-06 13:02:00.503	user_d0fd848b-f2ae-4d24-8b70-42b2b1e9a65b	Рахель	https://ui-avatars.com/api/?name=%D0%A0%D0%9B&background=random&color=fff&size=128	t	f	Лихачева	\N	\N	f	f
37f4887b-6db0-4c29-bacb-648eb7dae16f	Ester.Belousov@gmail.com	2025-08-06 13:02:00.505	2025-08-06 13:02:00.505	user_9d49efd5-a1da-4f46-9dee-fa7c5fbb8cca	Эстер	https://ui-avatars.com/api/?name=%D0%AD%D0%91&background=random&color=fff&size=128	t	f	Белоусов	\N	\N	f	f
fd6fa884-b34d-49e9-87d6-66acbcd965b7	Ester.Bespalova45@mail.ru	2025-08-06 13:02:00.507	2025-08-06 13:02:00.507	user_606178e7-4de2-48be-b057-e445925df8e8	Эстер	https://ui-avatars.com/api/?name=%D0%AD%D0%91&background=random&color=fff&size=128	t	f	Беспалова	\N	\N	f	f
6ffa6680-8de1-4466-bf1c-95049067388b	Florentin.Biryukova47@yahoo.com	2025-08-06 13:02:00.509	2025-08-06 13:02:00.509	user_4ba4aeac-6073-448c-8da2-aca5b348618e	Флорентин	https://ui-avatars.com/api/?name=%D0%A4%D0%91&background=random&color=fff&size=128	t	f	Бирюкова	\N	\N	f	f
0a084d9b-96ce-4bf2-a61a-53d8e3e5d937	Vsevolod_Davydova7@hotmail.com	2025-08-06 13:02:00.511	2025-08-06 13:02:00.511	user_abdc567d-043a-4b0f-8df3-2c8a28a6faf4	Всеволод	https://ui-avatars.com/api/?name=%D0%92%D0%94&background=random&color=fff&size=128	t	f	Давыдова	\N	\N	f	f
f55ecd66-83eb-4dd6-be87-d012cc9efe5b	Eliezer_Fedorov42@mail.ru	2025-08-06 13:02:00.514	2025-08-06 13:02:00.514	user_5c1af87a-2ef6-4b70-8303-9372609c5ff9	Элиэзер	https://ui-avatars.com/api/?name=%D0%AD%D0%A4&background=random&color=fff&size=128	t	f	Федоров	\N	\N	f	f
a4c29016-62ad-42e2-9cbf-78271135e760	Gennadii.Isakov@hotmail.com	2025-08-06 13:02:00.516	2025-08-06 13:02:00.516	user_2001d78c-9f0c-44ee-91a4-5f082c58671d	Геннадий	https://ui-avatars.com/api/?name=%D0%93%D0%98&background=random&color=fff&size=128	t	f	Исаков	\N	\N	f	f
a1e8a481-6482-4ade-96ca-8820343333ca	Kazimir_Zaitseva@gmail.com	2025-08-06 13:02:00.518	2025-08-06 13:02:00.518	user_ef7472b4-8db9-426b-8d72-d57a38a88ec8	Казимир	https://ui-avatars.com/api/?name=%D0%9A%D0%97&background=random&color=fff&size=128	t	f	Зайцева	\N	\N	f	f
c00d669b-8d12-48bf-8fcc-5bb8808d2326	Evgeniya.Dmitrieva79@hotmail.com	2025-08-06 13:02:00.525	2025-08-06 13:02:00.525	user_6d54f6b1-b5a0-4655-a419-3ce93dc9f322	Евгения	https://ui-avatars.com/api/?name=%D0%95%D0%94&background=random&color=fff&size=128	t	f	Дмитриева	\N	\N	f	f
44382138-234b-44bc-a5a4-9aa2de01415a	Ada_Timofeeva@ya.ru	2025-08-06 13:02:00.527	2025-08-06 13:02:00.527	user_d1bf0d73-93fe-44ff-9212-f4df496d7e82	Ада	https://ui-avatars.com/api/?name=%D0%90%D0%A2&background=random&color=fff&size=128	t	f	Тимофеева	\N	\N	f	f
98d4949e-3eba-4255-af43-d87d5f313db7	Leya.Dmitrieva97@yahoo.com	2025-08-06 13:02:00.53	2025-08-06 13:02:00.53	user_7462504e-c246-4cab-89e4-22b8eada1016	Лея	https://ui-avatars.com/api/?name=%D0%9B%D0%94&background=random&color=fff&size=128	t	f	Дмитриева	\N	\N	f	f
8c3e8d16-538e-4104-8bea-0a984f3bb59d	Mefodii.Kalashnikova54@gmail.com	2025-08-06 13:02:00.533	2025-08-06 13:02:00.533	user_0ddd81a1-7c60-4e2f-a28c-7ec25401a571	Мефодий	https://ui-avatars.com/api/?name=%D0%9C%D0%9A&background=random&color=fff&size=128	t	f	Калашникова	\N	\N	f	f
edf60f47-20f5-4cfb-8601-f9038695df2c	Batsheva.Blokhina28@yahoo.com	2025-08-06 13:02:00.534	2025-08-06 13:02:00.534	user_436d9f3f-cd68-4e90-8841-932e9c5548fe	Батшева	https://ui-avatars.com/api/?name=%D0%91%D0%91&background=random&color=fff&size=128	t	f	Блохина	\N	\N	f	f
abbdf8d8-9951-48cf-afc5-74751feec285	Irina_Osipova91@yandex.ru	2025-08-06 13:02:00.537	2025-08-06 13:02:00.537	user_45cc792e-e9dd-47d9-99b1-37f8eb0f243c	Ирина	https://ui-avatars.com/api/?name=%D0%98%D0%9E&background=random&color=fff&size=128	t	f	Осипова	\N	\N	f	f
dba8fcf1-b3ce-4004-a7ff-64253437bf5e	Martukyan_Odintsov@ya.ru	2025-08-06 13:02:00.539	2025-08-06 13:02:00.539	user_d5265b63-f367-4bcc-b9c5-96a68ad5ac32	Мартьян	https://ui-avatars.com/api/?name=%D0%9C%D0%9E&background=random&color=fff&size=128	t	f	Одинцов	\N	\N	f	f
7343f77d-29bb-41ff-a84f-2f1c650d4eca	Avgust.Fedotova@ya.ru	2025-08-06 13:02:00.542	2025-08-06 13:02:00.542	user_b74a3a1e-c21f-4cc2-9ccb-b8317eacad42	Август	https://ui-avatars.com/api/?name=%D0%90%D0%A4&background=random&color=fff&size=128	t	f	Федотова	\N	\N	f	f
508eb2a9-78f8-4866-a8f2-e824f61ca21f	Ester.Makarova@yandex.ru	2025-08-06 13:02:00.543	2025-08-06 13:02:00.543	user_aa153a4b-5be8-4af7-b5b1-5eb9bb5a4dc6	Эстер	https://ui-avatars.com/api/?name=%D0%AD%D0%9C&background=random&color=fff&size=128	t	f	Макарова	\N	\N	f	f
1f797e17-641f-4f97-af0b-3e795c7d33aa	Evsei.Myasnikova37@yahoo.com	2025-08-06 13:02:00.545	2025-08-06 13:02:00.545	user_08c1bcbe-9309-4fcd-8296-54fdfc92c5b1	Евсей	https://ui-avatars.com/api/?name=%D0%95%D0%9C&background=random&color=fff&size=128	t	f	Мясникова	\N	\N	f	f
959f7d59-3767-485e-b608-136ef1dace54	Miriam_Kuznetsov67@mail.ru	2025-08-06 13:02:00.548	2025-08-06 13:02:00.548	user_76ab7657-c5ec-4d6e-a206-76732a44230c	Мириам	https://ui-avatars.com/api/?name=%D0%9C%D0%9A&background=random&color=fff&size=128	t	f	Кузнецов	\N	\N	f	f
fd9174cb-be97-487d-8a71-67cbc4270440	Iekhuda.Molchanova3@ya.ru	2025-08-06 13:02:00.55	2025-08-06 13:02:00.55	user_4bfe5a11-64a6-41de-8288-99f3bebe80e1	Иехуда	https://ui-avatars.com/api/?name=%D0%98%D0%9C&background=random&color=fff&size=128	t	f	Молчанова	\N	\N	f	f
33ddb240-14da-4342-86d4-63eddaab9fb8	Rakheluk_Grigorukeva@hotmail.com	2025-08-06 13:02:00.552	2025-08-06 13:02:00.552	user_b5a0e8ba-ad3d-48ef-8412-fe4112c3f788	Рахель	https://ui-avatars.com/api/?name=%D0%A0%D0%93&background=random&color=fff&size=128	t	f	Григорьева	\N	\N	f	f
ba4cd1f2-6cde-4330-859f-2574a054a6a0	Shlomo.Kuznetsov8@hotmail.com	2025-08-06 13:02:00.558	2025-08-06 13:02:00.558	user_7d44bec0-55a4-4828-aaf4-becceae1fcc8	Шломо	https://ui-avatars.com/api/?name=%D0%A8%D0%9A&background=random&color=fff&size=128	t	f	Кузнецов	\N	\N	f	f
9fd2268e-eccf-4101-9ba6-0fafdd5dc308	Shlomo_Denisova@mail.ru	2025-08-06 13:02:00.56	2025-08-06 13:02:00.56	user_dda84620-ae8d-4ff4-9ed2-0ce7f46b50c9	Шломо	https://ui-avatars.com/api/?name=%D0%A8%D0%94&background=random&color=fff&size=128	t	f	Денисова	\N	\N	f	f
a2cc77b1-e79d-4091-a012-5e8faf6f1a17	Menakhem.Kazakova@yahoo.com	2025-08-06 13:02:00.562	2025-08-06 13:02:00.562	user_3941245f-2b88-45d9-9e5d-a876501ae904	Менахем	https://ui-avatars.com/api/?name=%D0%9C%D0%9A&background=random&color=fff&size=128	t	f	Казакова	\N	\N	f	f
36162ad9-fae2-402a-a46c-2fb7b20dfe2b	Miriam.Fedorov41@hotmail.com	2025-08-06 13:02:00.564	2025-08-06 13:02:00.564	user_daf3b9d7-dec6-4f51-9478-3d5ecffef4b9	Мириам	https://ui-avatars.com/api/?name=%D0%9C%D0%A4&background=random&color=fff&size=128	t	f	Федоров	\N	\N	f	f
a2cfc639-dbfe-43ae-8103-9dc3641cb1e0	Kondratii.Dmitriev23@gmail.com	2025-08-06 13:02:00.567	2025-08-06 13:02:00.567	user_0522e7be-e38d-40bb-9c47-4edc2ac5a270	Кондратий	https://ui-avatars.com/api/?name=%D0%9A%D0%94&background=random&color=fff&size=128	t	f	Дмитриев	\N	\N	f	f
cc1c6c7c-bc8a-44f4-a545-4a61e472cbe4	Ryurik.Sukhanova8@ya.ru	2025-08-06 13:02:00.57	2025-08-06 13:02:00.57	user_4f5d3f30-3231-47eb-b565-252040b1401c	Рюрик	https://ui-avatars.com/api/?name=%D0%A0%D0%A1&background=random&color=fff&size=128	t	f	Суханова	\N	\N	f	f
0d5a2f66-3303-4540-b8f4-6172b46b5aa5	Valeriya.Trofimov@mail.ru	2025-08-06 13:02:00.573	2025-08-06 13:02:00.573	user_95bcf013-7f97-405c-a9ea-8913953ac42e	Валерия	https://ui-avatars.com/api/?name=%D0%92%D0%A2&background=random&color=fff&size=128	t	f	Трофимов	\N	\N	f	f
cb3094a6-a4a6-4ae1-bfeb-6148c90b6521	Rakheluk.Naumova@gmail.com	2025-08-06 13:02:00.576	2025-08-06 13:02:00.576	user_c80753a2-b915-4b40-abb9-630881aefe12	Рахель	https://ui-avatars.com/api/?name=%D0%A0%D0%9D&background=random&color=fff&size=128	t	f	Наумова	\N	\N	f	f
8f3c9b8a-f09e-432f-ba98-495fa218d6e7	Vasilisa.Silina16@mail.ru	2025-08-06 13:02:00.578	2025-08-06 13:02:00.578	user_7bcaeb73-85f1-4ed7-ad1d-b7d98d1373cf	Василиса	https://ui-avatars.com/api/?name=%D0%92%D0%A1&background=random&color=fff&size=128	t	f	Силина	\N	\N	f	f
c2c72fe3-0042-439a-8a19-55fd6af2f0fd	Yakov.Simonov42@yahoo.com	2025-08-06 13:02:00.58	2025-08-06 13:02:00.58	user_cb7a18c2-c2a3-4ee8-ae27-2c8a595989f4	Яков	https://ui-avatars.com/api/?name=%D0%AF%D0%A1&background=random&color=fff&size=128	t	f	Симонов	\N	\N	f	f
7578e44e-cf0f-49b6-88db-4a32d2ae2260	Avraam.Abramova@yandex.ru	2025-08-06 13:02:00.583	2025-08-06 13:02:00.583	user_8bba54f8-dfd4-49a4-896e-5ec96fb4ed89	Авраам	https://ui-avatars.com/api/?name=%D0%90%D0%90&background=random&color=fff&size=128	t	f	Абрамова	\N	\N	f	f
17877592-a7f5-4625-93db-c568972985df	Khana.Mishin27@yahoo.com	2025-08-06 13:02:00.585	2025-08-06 13:02:00.585	user_1057ba69-295a-4612-8f4f-238f4ad055c9	Хана	https://ui-avatars.com/api/?name=%D0%A5%D0%9C&background=random&color=fff&size=128	t	f	Мишин	\N	\N	f	f
940eecca-eb65-4f9e-aee8-35b8a9434954	David.Egorov84@hotmail.com	2025-08-06 13:02:00.593	2025-08-06 13:02:00.593	user_70765ecf-0e10-4bb4-95e6-e8e85b44d9e5	Давид	https://ui-avatars.com/api/?name=%D0%94%D0%95&background=random&color=fff&size=128	t	f	Егоров	\N	\N	f	f
96f6c11e-0c1f-463d-8acf-289adedf19d9	Eliezer.Fomicheva44@yahoo.com	2025-08-06 13:02:00.595	2025-08-06 13:02:00.595	user_48ec6838-812d-4aa5-a703-a562797feccd	Элиэзер	https://ui-avatars.com/api/?name=%D0%AD%D0%A4&background=random&color=fff&size=128	t	f	Фомичева	\N	\N	f	f
a2fe62d3-682a-44b7-aef2-19729f90db4c	Menakhem.Gorbachev34@mail.ru	2025-08-06 13:02:00.598	2025-08-06 13:02:00.598	user_82f6c766-87ed-4b2f-9f59-9ab216d0457d	Менахем	https://ui-avatars.com/api/?name=%D0%9C%D0%93&background=random&color=fff&size=128	t	f	Горбачев	\N	\N	f	f
690de9bd-ba52-44b0-a215-93144f3e3c7d	Leya.Nikiforov88@yandex.ru	2025-08-06 13:02:00.599	2025-08-06 13:02:00.599	user_b7c4e9cc-b6a9-4b39-93f1-ea5006eb9aae	Лея	https://ui-avatars.com/api/?name=%D0%9B%D0%9D&background=random&color=fff&size=128	t	f	Никифоров	\N	\N	f	f
0dc654b2-b313-4d1f-9fdb-e2c32677c820	Eliezer_Kolobov24@hotmail.com	2025-08-06 13:02:00.602	2025-08-06 13:02:00.602	user_7bf5ecc2-dd0d-490f-86fb-9da3c23db4a2	Элиэзер	https://ui-avatars.com/api/?name=%D0%AD%D0%9A&background=random&color=fff&size=128	t	f	Колобов	\N	\N	f	f
cfeff061-858e-45bf-a64c-637f16d71d08	Menakhem_Savin54@yandex.ru	2025-08-06 13:02:00.604	2025-08-06 13:02:00.604	user_294141b7-a6ac-4c3b-9b48-2f2fa5b8613e	Менахем	https://ui-avatars.com/api/?name=%D0%9C%D0%A1&background=random&color=fff&size=128	t	f	Савин	\N	\N	f	f
846acb6c-87a8-42be-a98e-29585676432c	Venedikt.Safonov@yahoo.com	2025-08-06 13:02:00.607	2025-08-06 13:02:00.607	user_bf999fb8-127d-4bd5-a715-0637a13bfca4	Венедикт	https://ui-avatars.com/api/?name=%D0%92%D0%A1&background=random&color=fff&size=128	t	f	Сафонов	\N	\N	f	f
a4ea8dc9-6d76-49ec-a10d-e11d31047b35	Eliezer.Savelukev92@hotmail.com	2025-08-06 13:02:00.609	2025-08-06 13:02:00.609	user_3f1defef-efbb-487b-a648-8641174d1e89	Элиэзер	https://ui-avatars.com/api/?name=%D0%AD%D0%A1&background=random&color=fff&size=128	t	f	Савельев	\N	\N	f	f
1d61ef9a-0757-41e5-aa81-086ba550f0be	Batsheva.Komarov@ya.ru	2025-08-06 13:02:00.61	2025-08-06 13:02:00.61	user_e6c25a6d-f351-4ecd-b8f3-6042a6768075	Батшева	https://ui-avatars.com/api/?name=%D0%91%D0%9A&background=random&color=fff&size=128	t	f	Комаров	\N	\N	f	f
117327c7-2c05-4f3b-9b46-bb6a5858688e	Ladimir.Terentukeva73@ya.ru	2025-08-06 13:02:00.612	2025-08-06 13:02:00.612	user_040157d6-d2b5-4f84-9c39-a2ec7ae876a8	Ладимир	https://ui-avatars.com/api/?name=%D0%9B%D0%A2&background=random&color=fff&size=128	t	f	Терентьева	\N	\N	f	f
88ebdecb-ed0e-4749-a36b-1249e44db0c9	Ilukya.Gorbunov@ya.ru	2025-08-06 13:02:00.615	2025-08-06 13:02:00.615	user_4bf25ea4-fad5-4e0d-bc22-f45b1bc4faf5	Илья	https://ui-avatars.com/api/?name=%D0%98%D0%93&background=random&color=fff&size=128	t	f	Горбунов	\N	\N	f	f
faa12255-8224-415c-9d0a-218a7318082e	Varlaam.Krasiluknikov@yandex.ru	2025-08-06 13:02:00.617	2025-08-06 13:02:00.617	user_7aa7664a-6d28-47ce-84ba-13959467e5ba	Варлаам	https://ui-avatars.com/api/?name=%D0%92%D0%9A&background=random&color=fff&size=128	t	f	Красильников	\N	\N	f	f
b1f45ad4-2035-4924-b44c-ec45ddfb26f3	Afanasii.Fomicheva3@ya.ru	2025-08-06 13:02:00.619	2025-08-06 13:02:00.619	user_b73d1f99-4569-4d6a-a0a8-8efd3ae21866	Афанасий	https://ui-avatars.com/api/?name=%D0%90%D0%A4&background=random&color=fff&size=128	t	f	Фомичева	\N	\N	f	f
72f2c575-cc5b-4e1e-a18f-80ece19acc9e	Danila.Naumova@ya.ru	2025-08-06 13:02:00.621	2025-08-06 13:02:00.621	user_f36cdda3-dbea-4319-8e44-9e28dcdd553c	Данила	https://ui-avatars.com/api/?name=%D0%94%D0%9D&background=random&color=fff&size=128	t	f	Наумова	\N	\N	f	f
94415391-9c50-4435-947d-b97243a71057	Valerii.Likhachev@ya.ru	2025-08-06 13:02:00.623	2025-08-06 13:02:00.623	user_6ada329e-1928-47c0-bf30-14dbded0bd1c	Валерий	https://ui-avatars.com/api/?name=%D0%92%D0%9B&background=random&color=fff&size=128	t	f	Лихачев	\N	\N	f	f
055838f6-74fa-44c7-9e0b-8cd038256ca7	David_Kalashnikov@hotmail.com	2025-08-06 13:02:00.626	2025-08-06 13:02:00.626	user_018164bb-be13-4444-a239-251aaab97859	Давид	https://ui-avatars.com/api/?name=%D0%94%D0%9A&background=random&color=fff&size=128	t	f	Калашников	\N	\N	f	f
cc6d2957-58d8-4604-a92d-575565d83a8c	Filimon_Ivanov@yahoo.com	2025-08-06 13:02:00.628	2025-08-06 13:02:00.628	user_af5b0d5b-6614-4c26-961b-1e6e15b85935	Филимон	https://ui-avatars.com/api/?name=%D0%A4%D0%98&background=random&color=fff&size=128	t	f	Иванов	\N	\N	f	f
21376424-dc97-4f26-a947-366f9250e59c	Martyn_Dmitrieva@gmail.com	2025-08-06 13:02:00.63	2025-08-06 13:02:00.63	user_d2c61108-272f-4ce4-a46d-aa48ca4f9f25	Мартын	https://ui-avatars.com/api/?name=%D0%9C%D0%94&background=random&color=fff&size=128	t	f	Дмитриева	\N	\N	f	f
30efe7d5-e3dc-4222-84c5-7919e527ac05	Shimon_Kostina66@ya.ru	2025-08-06 13:02:00.632	2025-08-06 13:02:00.632	user_57dba92e-6ecc-4cdd-9bc8-d89b19a52d21	Шимон	https://ui-avatars.com/api/?name=%D0%A8%D0%9A&background=random&color=fff&size=128	t	f	Костина	\N	\N	f	f
f5455747-5375-42ca-a364-a42351e57769	Miriam_Samsonova@yandex.ru	2025-08-06 13:02:00.634	2025-08-06 13:02:00.634	user_4083b809-712d-401f-ab3c-f78c3ba94f91	Мириам	https://ui-avatars.com/api/?name=%D0%9C%D0%A1&background=random&color=fff&size=128	t	f	Самсонова	\N	\N	f	f
3af5a43b-6b95-46eb-b56b-c22c63bb44c2	Anastasiya_Fadeev@yandex.ru	2025-08-06 13:02:00.637	2025-08-06 13:02:00.637	user_26a24d6b-5f09-40b5-b292-81b725660512	Анастасия	https://ui-avatars.com/api/?name=%D0%90%D0%A4&background=random&color=fff&size=128	t	f	Фадеев	\N	\N	f	f
ee7bd362-9f93-467e-af74-1c688145bc68	Itskhak_Ryabova19@gmail.com	2025-08-06 13:02:00.639	2025-08-06 13:02:00.639	user_252d03a7-4524-467e-b335-b7d6a2f96812	Ицхак	https://ui-avatars.com/api/?name=%D0%98%D0%A0&background=random&color=fff&size=128	t	f	Рябова	\N	\N	f	f
cbb9738b-07e1-4855-a5b1-e376a422d44e	Kseniya.Potapov19@ya.ru	2025-08-06 13:02:00.642	2025-08-06 13:02:00.642	user_e89c47c2-4ab7-4ffb-9cc7-f053d3d6f2ca	Ксения	https://ui-avatars.com/api/?name=%D0%9A%D0%9F&background=random&color=fff&size=128	t	f	Потапов	\N	\N	f	f
23d233ef-b64e-4075-9147-846a603eee97	Fortunat_Panfilov13@ya.ru	2025-08-06 13:02:00.644	2025-08-06 13:02:00.644	user_afa4a9a8-fb4e-43a5-b185-c5914006877b	Фортунат	https://ui-avatars.com/api/?name=%D0%A4%D0%9F&background=random&color=fff&size=128	t	f	Панфилов	\N	\N	f	f
211c6c33-3439-48e4-b0f6-d33902832717	Valeriya_Belyakov@yahoo.com	2025-08-06 13:02:00.646	2025-08-06 13:02:00.646	user_01839516-7b8f-4f23-98cc-d3b634fc2629	Валерия	https://ui-avatars.com/api/?name=%D0%92%D0%91&background=random&color=fff&size=128	t	f	Беляков	\N	\N	f	f
695ad295-a7d3-47f6-8cc9-b123829e6809	Yurii_Nikolaev72@yandex.ru	2025-08-06 13:02:00.648	2025-08-06 13:02:00.648	user_6eec18dc-5e1d-48ba-9c01-aff9ec20b048	Юрий	https://ui-avatars.com/api/?name=%D0%AE%D0%9D&background=random&color=fff&size=128	t	f	Николаев	\N	\N	f	f
93eaaf28-0bc0-4628-a814-6ea042f0ef44	worknow.notifications@gmail.com	2025-08-07 06:55:15.294	2025-08-07 06:55:15.294	user_2tnxLkEalopDLnUWMFiSJAPCBKJ	Symon	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydG54TGxWMG16c2ZFN1o1SFZHNkhJVlFhNjEifQ	t	f	\N	\N	\N	f	f
352798b0-3f1a-4b4a-9aa1-e8d66255a36a	peterbaikov12@gmail.com	2025-08-06 13:03:16.812	2025-08-16 12:36:08.854	user_2t5vI9cGkwQ1BS0XmaBX2nJLvSe	Peter	https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ycU9kOGFoZ3FNSGNHdjUxc0VVMFhFemVTTlIiLCJyaWQiOiJ1c2VyXzJ0NXZJOWNHa3dRMUJTMFhtYUJYMm5KTHZTZSIsImluaXRpYWxzIjoiUEIifQ	t	t	Baikov	2025-09-15 12:36:08.844	sub_1RwjL5COLiDbHvw1LTYuDsa1	f	f
7da318cd-a40d-48df-ad30-b6e96978c9b8	burtman.samuel12@gmail.com	2025-09-13 08:46:59.513	2025-09-13 08:46:59.731	user_2tV7kx0v3ZlVbc7vjLLPdYA72Ec	Sam	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydFY3bDA5ZUtMWTFpcVlKUUFJVDRCaldTekcifQ	t	f	Burtman	\N	\N	f	f
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
bd1ead64-66ac-4cea-a382-ec25085124a3	cf53ede644f16978dfca4791115c9b79ad435f63445bbd319c633318dee6f814	2025-07-31 15:25:17.984141+03	20250629185823_use_clerk_user_id_for_messages	\N	\N	2025-07-31 15:25:17.944745+03	1
02835be4-40d3-4943-b9ac-9105e7da8075	bf0419b9c0281363794e87d3e43d73d365193ba342a8c5bf1894897830afd5da	2025-07-31 15:25:17.985616+03	20250630062328_add_shuttle_and_meals_to_job	\N	\N	2025-07-31 15:25:17.984532+03	1
c257028e-bae6-4417-9a05-b50b18ce2f20	44c92092a9601b3a33beb7e90f10ba4a27f34923f20ce1838353c10608c59d13	2025-07-31 15:25:17.991853+03	20250630144949_add_payment_model	\N	\N	2025-07-31 15:25:17.985828+03	1
fdec5d01-30f2-4878-9dac-ba4513b127a5	0a3fbc1b1610d78dc4cb27486f4d929a354e2cd355dab9f6013ab1fd94aa1d13	2025-07-31 15:25:17.994242+03	20250703125542_add_job_image_url	\N	\N	2025-07-31 15:25:17.992547+03	1
829a8056-54ea-4982-b051-6364e3a92bca	bb17dc1bf71561fd7eaa6db4cb9bf285ee3591938d567ffa26f898595de63360	2025-07-31 15:25:24.968481+03	20250731122524_add_newsletter_subscribers	\N	\N	2025-07-31 15:25:24.956281+03	1
20f93541-82bf-4632-9218-76eae8613ce8	d3b36688d72a4224ca82bec5abc3c91367ffc062322fa55d10d0c7a0158cf8a6	2025-08-02 08:58:06.169253+03	20250802055805_add_newsletter_filter_preferences	\N	\N	2025-08-02 08:58:06.142666+03	1
4985ebb0-6d8e-4a8e-89c0-4ecb5362bc67	c565a3c8e3335d18bc7051ba7e1a9d2a6ac26ced91dfbeb7da65e85c93221ecc	2025-08-03 13:03:55.739897+03	20250803100354_add_newsletter_verification	\N	\N	2025-08-03 13:03:55.229128+03	1
c79f63f3-cea3-4ef7-bdf7-398d7e1cfc9e	760ebda2b26e0b572432d0daeaadc2185265639c027f20f71fa1fbb7dbb3722a	2025-08-12 15:57:01.46027+03	20250101000000_add_daily_candidate_notifications	\N	\N	2025-08-12 15:57:01.449074+03	1
\.


--
-- Name: CategoryTranslation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CategoryTranslation_id_seq"', 522, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 174, true);


--
-- Name: CityTranslation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CityTranslation_id_seq"', 2456, true);


--
-- Name: City_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."City_id_seq"', 614, true);


--
-- Name: DailyCandidateNotification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DailyCandidateNotification_id_seq"', 1, true);


--
-- Name: Job_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Job_id_seq"', 859, true);


--
-- Name: NewsletterSubscriber_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."NewsletterSubscriber_id_seq"', 30, true);


--
-- Name: NewsletterVerification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."NewsletterVerification_id_seq"', 33, true);


--
-- Name: Payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Payment_id_seq"', 1, false);


--
-- Name: Seeker_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Seeker_id_seq"', 43, true);


--
-- Name: CategoryTranslation CategoryTranslation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CategoryTranslation"
    ADD CONSTRAINT "CategoryTranslation_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: CityTranslation CityTranslation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CityTranslation"
    ADD CONSTRAINT "CityTranslation_pkey" PRIMARY KEY (id);


--
-- Name: City City_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_pkey" PRIMARY KEY (id);


--
-- Name: DailyCandidateNotification DailyCandidateNotification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DailyCandidateNotification"
    ADD CONSTRAINT "DailyCandidateNotification_pkey" PRIMARY KEY (id);


--
-- Name: Job Job_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: NewsletterSubscriber NewsletterSubscriber_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NewsletterSubscriber"
    ADD CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY (id);


--
-- Name: NewsletterVerification NewsletterVerification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NewsletterVerification"
    ADD CONSTRAINT "NewsletterVerification_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Seeker Seeker_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Seeker"
    ADD CONSTRAINT "Seeker_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: CategoryTranslation_categoryId_lang_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CategoryTranslation_categoryId_lang_key" ON public."CategoryTranslation" USING btree ("categoryId", lang);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: CityTranslation_cityId_lang_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CityTranslation_cityId_lang_key" ON public."CityTranslation" USING btree ("cityId", lang);


--
-- Name: City_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "City_name_key" ON public."City" USING btree (name);


--
-- Name: DailyCandidateNotification_sentAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "DailyCandidateNotification_sentAt_idx" ON public."DailyCandidateNotification" USING btree ("sentAt");


--
-- Name: Job_boostedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Job_boostedAt_idx" ON public."Job" USING btree ("boostedAt");


--
-- Name: NewsletterSubscriber_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON public."NewsletterSubscriber" USING btree (email);


--
-- Name: NewsletterVerification_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "NewsletterVerification_email_key" ON public."NewsletterVerification" USING btree (email);


--
-- Name: Seeker_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Seeker_slug_key" ON public."Seeker" USING btree (slug);


--
-- Name: User_clerkUserId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_clerkUserId_key" ON public."User" USING btree ("clerkUserId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: CategoryTranslation CategoryTranslation_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CategoryTranslation"
    ADD CONSTRAINT "CategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CityTranslation CityTranslation_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CityTranslation"
    ADD CONSTRAINT "CityTranslation_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Job Job_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Job Job_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Job Job_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

