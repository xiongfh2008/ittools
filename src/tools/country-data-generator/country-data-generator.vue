<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCopy } from '@/composable/copy';

// Define form structure
const form = ref({
  country: null as string | null,
  dataType: 'personal' as 'personal' | 'company',
  recordCount: 10,
  format: 'json' as 'json' | 'csv' | 'table',
});

// Fuzzy filter function for country selection
function fuzzyFilter(pattern: string, option: { label: string; value: string }) {
  if (!pattern) { return true; }
  const lowerPattern = pattern.toLowerCase();
  const lowerLabel = option.label.toLowerCase();
  const lowerValue = option.value.toLowerCase();

  // Check if pattern matches in any part of the label or value
  return lowerLabel.includes(lowerPattern) || lowerValue.includes(lowerPattern);
}

// Validation rules
const rules = {
  country: {
    required: true,
    message: 'Please select a country',
    trigger: 'change',
  },
};

// Form reference
const formRef = ref();

// Country options
const countryOptions = [
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Japan', value: 'JP' },
  { label: 'China', value: 'CN' },
  { label: 'India', value: 'IN' },
  { label: 'Brazil', value: 'BR' },
  { label: 'Australia', value: 'AU' },
  { label: 'South Korea', value: 'KR' },
  { label: 'Mexico', value: 'MX' },
  { label: 'Italy', value: 'IT' },
  { label: 'Spain', value: 'ES' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Russia', value: 'RU' },
  { label: 'Saudi Arabia', value: 'SA' },
  { label: 'United Arab Emirates', value: 'AE' },
  { label: 'Switzerland', value: 'CH' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Norway', value: 'NO' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Finland', value: 'FI' },
  { label: 'Singapore', value: 'SG' },
  { label: 'Malaysia', value: 'MY' },
  { label: 'Thailand', value: 'TH' },
  { label: 'Indonesia', value: 'ID' },
  { label: 'Philippines', value: 'PH' },
  { label: 'Vietnam', value: 'VN' },
  { label: 'Turkey', value: 'TR' },
  { label: 'Poland', value: 'PL' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Austria', value: 'AT' },
  { label: 'Greece', value: 'GR' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Ireland', value: 'IE' },
  { label: 'New Zealand', value: 'NZ' },
  { label: 'South Africa', value: 'ZA' },
  { label: 'Egypt', value: 'EG' },
  { label: 'Nigeria', value: 'NG' },
  { label: 'Kenya', value: 'KE' },
];

// State variables
const isGenerating = ref(false);
const generatedData = ref<string | null>(null);

// Table data computed properties
const tableHeaders = computed(() => {
  if (!generatedData.value) { return []; }

  try {
    const parsed = JSON.parse(generatedData.value);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return Object.keys(parsed[0]);
    }
  }
  catch (e) {
    // Handle non-JSON data
  }
  return [];
});

const tableData = computed(() => {
  if (!generatedData.value) { return []; }

  try {
    const parsed = JSON.parse(generatedData.value);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  }
  catch (e) {
    // Handle non-JSON data
  }
  return [];
});

// Function to generate data
async function generateData() {
  await formRef.value?.validate();

  isGenerating.value = true;

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Generate mock data based on selected options
  const mockData = generateMockData(form.value);

  if (form.value.format === 'csv') {
    generatedData.value = convertToCSV(mockData);
  }
  else if (form.value.format === 'json') {
    generatedData.value = JSON.stringify(mockData, null, 2);
  }
  else {
    // For table format, we still store JSON but render differently
    generatedData.value = JSON.stringify(mockData, null, 2);
  }

  isGenerating.value = false;
}

// Function to generate mock data
function generateMockData(formData: typeof form.value) {
  const records = [];
  const country = formData.country || 'US';

  for (let i = 0; i < formData.recordCount; i++) {
    const record: Record<string, any> = {};

    if (formData.dataType === 'personal') {
      record.id = i + 1;
      record.firstName = getRandomFirstName(country);
      record.lastName = getRandomLastName(country);
      record.email = `${record.firstName.toLowerCase()}.${record.lastName.toLowerCase()}${i}@example.com`;
      record.phone = generatePhoneNumber(country);
      record.address = generateAddress(country);
      record.city = getRandomCity(country);
      record.postalCode = generatePostalCode(country);
      record.country = country;
      record.birthDate = generateRandomDate();
      record.age = Math.floor(Math.random() * 50) + 18;
    }

    if (formData.dataType === 'company') {
      record.companyName = generateCompanyName(country);
      record.companyEmail = `${record.companyName.toLowerCase().replace(/\s+/g, '')}@example.com`;
      record.companyPhone = generatePhoneNumber(country);
      record.companyAddress = generateAddress(country);
      record.companyCity = getRandomCity(country);
      record.companyPostalCode = generatePostalCode(country);
      record.industry = getRandomIndustry();
      record.employees = Math.floor(Math.random() * 1000) + 1;
    }

    records.push(record);
  }

  return records;
}

// Helper functions for generating mock data
function getRandomFirstName(country: string) {
  const firstNames: Record<string, string[]> = {
    US: ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'],
    CA: ['Michael', 'Sarah', 'David', 'Emily', 'Christopher', 'Emma', 'Matthew', 'Olivia', 'Joshua', 'Ava'],
    GB: ['David', 'Emma', 'Christopher', 'Sophie', 'Thomas', 'Olivia', 'James', 'Amelia', 'William', 'Isla'],
    DE: ['Hans', 'Anna', 'Peter', 'Marie', 'Werner', 'Karin', 'Dieter', 'Petra', 'Frank', 'Susanne'],
    FR: ['Jean', 'Marie', 'Pierre', 'Claire', 'Michel', 'Sophie', 'Paul', 'Isabelle', 'Louis', 'Juliette'],
    JP: ['Taro', 'Hanako', 'Jiro', 'Yuki', 'Saburo', 'Keiko', 'Yoshiro', 'Fumiko', 'Ichiro', 'Reiko'],
    CN: ['Wei', 'Li', 'Zhang', 'Jing', 'Xu', 'Yan', 'Liu', 'Fang', 'Chen', 'Min'],
    IN: ['Raj', 'Priya', 'Amit', 'Sita', 'Vikram', 'Anita', 'Suresh', 'Kavita', 'Arjun', 'Divya'],
    BR: ['João', 'Maria', 'José', 'Ana', 'Francisco', 'Antônia', 'Carlos', 'Francisca', 'Pedro', 'Luiza'],
    AU: ['Michael', 'Emma', 'William', 'Olivia', 'James', 'Sophie', 'Benjamin', 'Chloe', 'Daniel', 'Mia'],
    RU: ['Alexei', 'Anna', 'Dmitri', 'Maria', 'Sergei', 'Elena', 'Igor', 'Natalia', 'Vladimir', 'Svetlana'],
    SA: ['Ahmad', 'Fatima', 'Omar', 'Aisha', 'Mohammed', 'Khadijah', 'Saud', 'Layla', 'Khalid', 'Zainab'],
    AE: ['Ahmad', 'Fatima', 'Omar', 'Aisha', 'Mohammed', 'Khadijah', 'Saud', 'Layla', 'Khalid', 'Zainab'],
    CH: ['Hans', 'Anna', 'Peter', 'Marie', 'Werner', 'Karin', 'Dieter', 'Petra', 'Frank', 'Susanne'],
    SE: ['Erik', 'Anna', 'Lars', 'Maria', 'Karl', 'Eva', 'Anders', 'Lisa', 'Gunnar', 'Ingrid'],
    NO: ['Erik', 'Anna', 'Lars', 'Maria', 'Karl', 'Eva', 'Anders', 'Lisa', 'Gunnar', 'Ingrid'],
    DK: ['Jens', 'Mette', 'Lars', 'Anna', 'Mikkel', 'Sara', 'Anders', 'Lotte', 'Peter', 'Ida'],
    FI: ['Matti', 'Anneli', 'Jari', 'Kaija', 'Tapio', 'Liisa', 'Tuomo', 'Marja', 'Arto', 'Pirjo'],
    SG: ['Wei', 'Li', 'Zhang', 'Jing', 'Xu', 'Yan', 'Liu', 'Fang', 'Chen', 'Min'],
    MY: ['Ahmad', 'Fatima', 'Ravi', 'Siti', 'Suresh', 'Aishah', 'Lee', 'Wong', 'Tan', 'Lim'],
    TH: ['Somchai', 'Somsak', 'Niran', 'Orathai', 'Pichai', 'Malee', 'Krit', 'Siriporn', 'Anuchart', 'Chompoo'],
    ID: ['Budi', 'Siti', 'Agus', 'Dewi', 'Andi', 'Lina', 'Rudi', 'Maya', 'Joko', 'Ratna'],
    PH: ['Juan', 'Maria', 'Jose', 'Ana', 'Carlos', 'Carmen', 'Ricardo', 'Esperanza', 'Miguel', 'Juana'],
    VN: ['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Phan', 'Vu', 'Dang', 'Bui', 'Do'],
    TR: ['Ahmet', 'Ayşe', 'Mehmet', 'Fatma', 'Mustafa', 'Emine', 'İbrahim', 'Zeynep', 'Osman', 'Hülya'],
    PL: ['Jan', 'Anna', 'Piotr', 'Maria', 'Krzysztof', 'Katarzyna', 'Andrzej', 'Małgorzata', 'Tomasz', 'Agnieszka'],
    BE: ['Pieter', 'Emma', 'Lucas', 'Laura', 'Thomas', 'Julie', 'Lars', 'Marie', 'Simon', 'Sarah'],
    AT: ['Hans', 'Anna', 'Peter', 'Marie', 'Werner', 'Karin', 'Dieter', 'Petra', 'Frank', 'Susanne'],
    GR: ['Nikos', 'Maria', 'Dimitris', 'Eleni', 'Giorgos', 'Georgia', 'Panos', 'Katerina', 'Costas', 'Ioanna'],
    PT: ['João', 'Maria', 'José', 'Ana', 'Francisco', 'Antônia', 'Carlos', 'Francisca', 'Pedro', 'Luiza'],
    IE: ['Seán', 'Siobhan', 'Michael', 'Aoife', 'Patrick', 'Niamh', 'Conor', 'Emer', 'Damien', 'Clodagh'],
    NZ: ['Michael', 'Emma', 'William', 'Olivia', 'James', 'Sophie', 'Benjamin', 'Chloe', 'Daniel', 'Mia'],
    ZA: ['John', 'Sarah', 'David', 'Lerato', 'Michael', 'Thandi', 'Peter', 'Nomthandazo', 'James', 'Precious'],
    EG: ['Ahmed', 'Fatma', 'Mohamed', 'Zeinab', 'Ali', 'Aisha', 'Hassan', 'Safia', 'Khaled', 'Naglaa'],
    NG: ['Chinedu', 'Amina', 'Emeka', 'Fatimah', 'Kemi', 'Uche', 'Segun', 'Bisi', 'Tunde', 'Adaora'],
    KE: ['John', 'Mary', 'Mwangi', 'Wanjiku', 'Peter', 'Grace', 'Sam', 'Esther', 'David', 'Jane'],
  };

  const names = firstNames[country] || firstNames.US;
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomLastName(country: string) {
  const lastNames: Record<string, string[]> = {
    US: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'],
    CA: ['Smith', 'Brown', 'Tremblay', 'Martin', 'Roy', 'Wilson', 'Macdonald', 'Gagnon', 'Johnson', 'Leblanc'],
    GB: ['Smith', 'Jones', 'Taylor', 'Williams', 'Brown', 'Davies', 'Evans', 'Wilson', 'Thomas', 'Roberts'],
    DE: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann'],
    FR: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'],
    JP: ['Tanaka', 'Suzuki', 'Sato', 'Yamada', 'Watanabe', 'Ito', 'Nakamura', 'Kobayashi', 'Yamamoto', 'Kato'],
    CN: ['Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou'],
    IN: ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Mehta', 'Joshi', 'Nair', 'Iyer'],
    BR: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes'],
    AU: ['Smith', 'Jones', 'Williams', 'Brown', 'Wilson', 'Taylor', 'Morton', 'White', 'Martin', 'Anderson'],
    RU: ['Ivanov', 'Smirnov', 'Kuznetsov', 'Popov', 'Voronov', 'Nikitin', 'Makarov', 'Petrov', 'Sokolov', 'Volkov'],
    SA: ['Al Saud', 'Al-Rashid', 'Al Jasser', 'Al-Thani', 'Al-Nuaimi', 'Al-Maktoum', 'Al-Qasimi', 'Al Sabah', 'Al-Harithi', 'Al-Waeli'],
    AE: ['Al Maktoum', 'Al Nahyan', 'Al Qasimi', 'Al Sharqi', 'Al Suwaidi', 'Al Baloushi', 'Al Kindi', 'Al Shamsi', 'Al Dhaheri', 'Al Ameri'],
    CH: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann'],
    SE: ['Andersson', 'Johansson', 'Strömberg', 'Nilsson', 'Lindqvist', 'Eriksson', 'Larsson', 'Olsson', 'Persson', 'Svensson'],
    NO: ['Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen', 'Nilsen', 'Pedersen', 'Berg', 'Halvorsen', 'Dahl'],
    DK: ['Nielsen', 'Hansen', 'Pedersen', 'Andersen', 'Christensen', 'Larsen', 'Sørensen', 'Rasmussen', 'Jørgensen', 'Petersen'],
    FI: ['Korhonen', 'Virtanen', 'Mäkinen', 'Nieminen', 'Koskinen', 'Järvinen', 'Lahtinen', 'Lehtonen', 'Heikkinen', 'Hämäläinen'],
    SG: ['Wong', 'Chen', 'Li', 'Lin', 'Tan', 'Lim', 'Lee', 'Teo', 'Goh', 'Low'],
    MY: ['Raj', 'Singh', 'Kumar', 'Lee', 'Wong', 'Chen', 'Lim', 'Tang', 'Gan', 'Ooi'],
    TH: ['Jaidee', 'Sawasdee', 'Srichaphan', 'Sornsri', 'Thongsri', 'Wattanasin', 'Prachaya', 'Khumkrong', 'Sukhon', 'Ploysoong'],
    ID: ['Santoso', 'Wijaya', 'Siregar', 'Hasanah', 'Putra', 'Sari', 'Kusuma', 'Pratama', 'Permadi', 'Lestari'],
    PH: ['Garcia', 'Reyes', 'Cruz', 'Bautista', 'Aquino', 'Dela Cruz', 'Santos', 'Gonzales', 'Castillo', 'Mendoza'],
    VN: ['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Phan', 'Vu', 'Dang', 'Bui', 'Do'],
    TR: ['Yılmaz', 'Demir', 'Çelik', 'Kılıç', 'Öztürk', 'Arslan', 'Sarıoğlu', 'Koç', 'Aydın', 'Şahin'],
    PL: ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Dąbrowski', 'Zieliński', 'Jankowski'],
    BE: ['Peeters', 'Janssens', 'Maes', 'Jacobs', 'Willems', 'Claes', 'Geerts', 'Goossens', 'De Smet', 'Vandenberghe'],
    AT: ['Gruber', 'Huber', 'Steiner', 'Binder', 'Hofer', 'Mayr', 'Fuchs', 'Wimmer', 'Lechner', 'Ebner'],
    GR: ['Papadopoulos', 'Vasilopoulos', 'Georgiou', 'Demetriou', 'Pavlou', 'Androulakis', 'Kostopoulos', 'Nikolaou', 'Ioannou', 'Panayiotou'],
    PT: ['Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Jesus', 'Sousa'],
    IE: ['Murphy', 'Kelly', 'O\'Sullivan', 'Walsh', 'Smith', 'O\'Brien', 'Byrne', 'Ryan', 'O\'Connor', 'Allen'],
    NZ: ['Smith', 'Brown', 'Wilson', 'Taylor', 'Morton', 'White', 'Martin', 'Anderson', 'Thompson', 'Clarke'],
    ZA: ['Van der Merwe', 'Nel', 'Botha', 'Van Wyk', 'Jackson', 'Moodley', 'Pretorius', 'Meyer', 'Du Plessis', 'Williams'],
    EG: ['Mohamed', 'Ahmed', 'Ibrahim', 'Ali', 'Hassan', 'Abdel', 'Kamel', 'Sayed', 'Mostafa', 'Ashraf'],
    NG: ['Okonkwo', 'Eze', 'Okafor', 'Madu', 'Emeka', 'Chukwu', 'Nwankwo', 'Osei', 'Adebayo', 'Olatunji'],
    KE: ['Ochieng', 'Omondi', 'Otieno', 'Odhiambo', 'Kamau', 'Wanjiku', 'Wambui', 'Karimi', 'Ndung\'u', 'Chebet'],
  };

  const names = lastNames[country] || lastNames.US;
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomCity(country: string) {
  const cities: Record<string, string[]> = {
    US: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
    CA: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
    GB: ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Cardiff'],
    DE: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen'],
    FR: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
    JP: ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama'],
    CN: ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Tianjin', 'Chongqing', 'Hong Kong', 'Shenzhen', 'Hangzhou', 'Nanjing'],
    IN: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'],
    BR: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
    AU: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong'],
    RU: ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Omsk', 'Rostov-on-Don'],
    SA: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Ta\'if', 'Tabuk', 'Al Jubail', 'Al Khobar', 'Abha'],
    AE: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain', 'Al Ain', 'Khor Fakkan', 'Jebel Ali'],
    CH: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Winterthur', 'Lucerne', 'St. Gallen', 'Lugano', 'Biel'],
    SE: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping'],
    NO: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Drammen', 'Fredrikstad', 'Kristiansand', 'Tønsberg', 'Sandnes', 'Arendal'],
    DK: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde'],
    FI: ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori'],
    SG: ['Singapore', 'Jurong', 'Woodlands', 'Yishun', 'Toa Payoh', 'Ang Mo Kio', 'Bishan', 'Bedok', 'Hougang', 'Simei'],
    MY: ['Kuala Lumpur', 'George Town', 'Ipoh', 'Kuching', 'Johor Bahru', 'Petaling Jaya', 'Kelantan', 'Shah Alam', 'Malacca', 'Kota Kinabalu'],
    TH: ['Bangkok', 'Nonthaburi', 'Nakhon Ratchasima', 'Chiang Mai', 'Udon Thani', 'Hat Yai', 'Khon Kaen', 'Pak Kret', 'Surat Thani', 'Phuket'],
    ID: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi'],
    PH: ['Manila', 'Quezon City', 'Davao', 'Cebu', 'Zamboanga', 'Cagayan de Oro', 'Manila', 'Pasig', 'Valenzuela', 'Las Piñas'],
    VN: ['Ho Chi Minh City', 'Hanoi', 'Haiphong', 'Da Nang', 'Cần Thơ', 'Biên Hòa', 'Hue', 'Nha Trang', 'Thanh Hóa', 'Vinh'],
    TR: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Adana', 'Gaziantep', 'Konya', 'Antalya', 'Diyarbakır', 'Mersin'],
    PL: ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'],
    BE: ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liege', 'Bruges', 'Schaerbeek', 'Namur', 'Anderlecht', 'Mons'],
    AT: ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn'],
    GR: ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa', 'Volos', 'Rhodes', 'Ioannina', 'Chania', 'Mytilene'],
    PT: ['Lisbon', 'Porto', 'Vila Nova de Gaia', 'Braga', 'Amadora', 'Almada', 'Odivelas', 'Coimbra', 'Funchal', 'Setúbal'],
    IE: ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk', 'Swords', 'Bray', 'Navan'],
    NZ: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Dunedin', 'Palmerston North', 'Napier', 'Rotorua', 'Whangarei'],
    ZA: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Pietermaritzburg', 'Benoni', 'Centurion'],
    EG: ['Cairo', 'Alexandria', 'Giza', 'Port Said', 'Suez', 'Luxor', 'Aswan', 'Mansoura', 'Tanta', 'Asyut'],
    NG: ['Lagos', 'Kano', 'Ibadan', 'Kaduna', 'Port Harcourt', 'Benin City', 'Maiduguri', 'Zaria', 'Aba', 'Jos'],
    KE: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kikuyu', 'Thika', 'Kitale', 'Malindi', 'Garissa'],
  };

  const cityList = cities[country] || cities.US;
  return cityList[Math.floor(Math.random() * cityList.length)];
}

function generatePhoneNumber(country: string) {
  const formats: Record<string, string> = {
    US: '+1-', // Will be followed by XXX-XXX-XXXX
    CA: '+1-', // Will be followed by XXX-XXX-XXXX
    GB: '+44-', // Will be followed by XX XXXX XXXX
    DE: '+49-', // Will be followed by XXX XXX XXXX
    FR: '+33-', // Will be followed by X XX XX XX XX
    JP: '+81-', // Will be followed by XXXX XXXX
    CN: '+86-', // Will be followed by XXX XXXX XXXX
    IN: '+91-', // Will be followed by XXX XXX XXXX
    BR: '+55-', // Will be followed by XX XXXXX XXXX
    AU: '+61-', // Will be followed by X XXXX XXXX
    RU: '+7-', // Will be followed by XXX XXX-XX-XX
    SA: '+966-', // Will be followed by X XXX XXXX
    AE: '+971-', // Will be followed by X XXX XXXX
    CH: '+41-', // Will be followed by XX XXX XXXX
    SE: '+46-', // Will be followed by XX XXX XXXX
    NO: '+47-', // Will be followed by XXX XX XXX
    DK: '+45-', // Will be followed by XXXX XXXX
    FI: '+358-', // Will be followed by XX XXX XXXX
    SG: '+65-', // Will be followed by XXXX XXXX
    MY: '+60-', // Will be followed by XX XXX XXXX
    TH: '+66-', // Will be followed by X XXX XXXX
    ID: '+62-', // Will be followed by XX XXX XXXX
    PH: '+63-', // Will be followed by XX XXX XXXX
    VN: '+84-', // Will be followed by XX XXX XXXX
    TR: '+90-', // Will be followed by XXX XXX XXXX
    PL: '+48-', // Will be followed by XXX XXX XXX
    BE: '+32-', // Will be followed by XX XXX XXXX
    AT: '+43-', // Will be followed by XXX XXX XXX
    GR: '+30-', // Will be followed by XXXX XXX XXXX
    PT: '+351-', // Will be followed by XX XXX XXXX
    IE: '+353-', // Will be followed by XX XXX XXXX
    NZ: '+64-', // Will be followed by XX XXX XXXX
    ZA: '+27-', // Will be followed by XX XXX XXXX
    EG: '+20-', // Will be followed by XX XXX XXXX
    NG: '+234-', // Will be followed by XX XXX XXXX
    KE: '+254-', // Will be followed by XX XXX XXXX
  };

  const format = formats[country] || formats.US;

  // Generate numbers based on country format
  if (['US', 'CA'].includes(country)) {
    const area = Math.floor(Math.random() * 900) + 100;
    const exch = Math.floor(Math.random() * 900) + 100;
    const numb = Math.floor(Math.random() * 9000) + 1000;
    return `${format}${area}-${exch}-${numb}`;
  }
  else if (country === 'GB') {
    const area = Math.floor(Math.random() * 900) + 100;
    const first = Math.floor(Math.random() * 9000) + 1000;
    const last = Math.floor(Math.random() * 9000) + 1000;
    return `${format}${area} ${first} ${last}`;
  }
  else if (country === 'DE') {
    const area = Math.floor(Math.random() * 9000) + 1000;
    const first = Math.floor(Math.random() * 9000) + 1000;
    const last = Math.floor(Math.random() * 9000) + 1000;
    return `${format}${area} ${first} ${last}`;
  }
  else if (country === 'FR') {
    const first = Math.floor(Math.random() * 9) + 1;
    const second = Math.floor(Math.random() * 90) + 10;
    const third = Math.floor(Math.random() * 90) + 10;
    const fourth = Math.floor(Math.random() * 90) + 10;
    const fifth = Math.floor(Math.random() * 90) + 10;
    return `${format}${first} ${second} ${third} ${fourth} ${fifth}`;
  }
  else if (country === 'JP') {
    const first = Math.floor(Math.random() * 900) + 100;
    const second = Math.floor(Math.random() * 9000) + 1000;
    return `${format}${first} ${second}`;
  }
  else if (['CN', 'IN'].includes(country)) {
    const first = Math.floor(Math.random() * 900) + 100;
    const second = Math.floor(Math.random() * 9000) + 1000;
    const third = Math.floor(Math.random() * 9000) + 1000;
    return `${format}${first} ${second} ${third}`;
  }
  else if (country === 'BR') {
    const area = Math.floor(Math.random() * 90) + 10;
    const first = Math.floor(Math.random() * 90000) + 10000;
    const second = Math.floor(Math.random() * 9000) + 1000;
    return `${format}${area} ${first} ${second}`;
  }
  else if (country === 'AU') {
    const area = Math.floor(Math.random() * 9) + 1;
    const first = Math.floor(Math.random() * 9000) + 1000;
    const second = Math.floor(Math.random() * 9000) + 1000;
    return `${format}${area} ${first} ${second}`;
  }
  else if (['RU', 'TR', 'PL'].includes(country)) {
    // Russian, Turkish, Polish format: +7 XXX XXX-XX-XX
    const first = Math.floor(Math.random() * 900) + 100;
    const second = Math.floor(Math.random() * 900) + 100;
    const third = Math.floor(Math.random() * 90) + 10;
    const fourth = Math.floor(Math.random() * 90) + 10;
    return `${format}${first} ${second}-${third}-${fourth}`;
  }
  else if (['SA', 'AE', 'MY', 'TH', 'ID', 'PH', 'VN', 'ZA', 'EG', 'NG', 'KE'].includes(country)) {
    // Middle Eastern and Asian format: +966 X XXX XXXX
    const first = Math.floor(Math.random() * 9) + 1;
    const second = Math.floor(Math.random() * 900) + 100;
    const third = Math.floor(Math.random() * 9000) + 1000;
    return `${format}${first} ${second} ${third}`;
  }
  else if (['SE', 'NO', 'BE', 'AT'].includes(country)) {
    // European format
    const first = Math.floor(Math.random() * 90) + 10;
    const second = Math.floor(Math.random() * 900) + 100;
    const third = Math.floor(Math.random() * 9000) + 1000;
    return `${format}${first} ${second} ${third}`;
  }
  else if (['DK', 'SG'].includes(country)) {
    // Denmark and Singapore: +45 XXXX XXXX
    const first = Math.floor(Math.random() * 9000) + 1000;
    const second = Math.floor(Math.random() * 9000) + 1000;
    return `${format}${first} ${second}`;
  }
  else if (['FI', 'IE', 'NZ', 'CH'].includes(country)) {
    // Finland, Ireland, New Zealand, Switzerland format
    const first = Math.floor(Math.random() * 90) + 10;
    const second = Math.floor(Math.random() * 900) + 100;
    const third = Math.floor(Math.random() * 9000) + 1000;
    return `${format}${first} ${second} ${third}`;
  }
  else if (['GR', 'PT'].includes(country)) {
    // Greece and Portugal format
    const first = Math.floor(Math.random() * 90) + 10;
    const second = Math.floor(Math.random() * 900) + 100;
    const third = Math.floor(Math.random() * 9000) + 1000;
    return `${format}${first} ${second} ${third}`;
  }
  else {
    // Default US format
    const area = Math.floor(Math.random() * 900) + 100;
    const exch = Math.floor(Math.random() * 900) + 100;
    const numb = Math.floor(Math.random() * 9000) + 1000;
    return `${format}${area}-${exch}-${numb}`;
  }
}

function generateAddress(country: string) {
  const streets = ['Main St', 'High St', 'Elm St', 'Oak Ave', 'Park Rd', 'Maple Dr', 'Cedar Ln', 'Pine St'];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const number = Math.floor(Math.random() * 999) + 1;

  return `${number} ${street}`;
}

function generatePostalCode(country: string) {
  if (country === 'US') {
    return `${Math.floor(Math.random() * 90000) + 10000}`;
  }
  else if (country === 'CA') {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter1 = letters.charAt(Math.floor(Math.random() * letters.length));
    const number1 = Math.floor(Math.random() * 10);
    const letter2 = letters.charAt(Math.floor(Math.random() * letters.length));
    const number2 = Math.floor(Math.random() * 10);
    const letter3 = letters.charAt(Math.floor(Math.random() * letters.length));
    const number3 = Math.floor(Math.random() * 10);
    return `${letter1}${number1}${letter2} ${number2}${letter3}${number3}`;
  }
  else if (country === 'GB') {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter1 = letters.charAt(Math.floor(Math.random() * letters.length));
    const letter2 = letters.charAt(Math.floor(Math.random() * letters.length));
    const number1 = Math.floor(Math.random() * 10);
    const number2 = Math.floor(Math.random() * 10);
    const letter3 = letters.charAt(Math.floor(Math.random() * letters.length));
    const letter4 = letters.charAt(Math.floor(Math.random() * letters.length));
    return `${letter1}${letter2}${number1}${number2} ${letter3}${letter4}`;
  }
  else if (['DE', 'FR', 'IT', 'ES', 'NL', 'RU', 'SA', 'AE', 'CH', 'SE', 'NO', 'DK', 'FI', 'SG', 'MY', 'TH', 'ID', 'PH', 'VN', 'TR', 'PL', 'BE', 'AT', 'GR', 'PT', 'IE', 'NZ', 'ZA', 'EG', 'NG', 'KE'].includes(country)) {
    // Countries with 5-digit postal codes
    return `${Math.floor(Math.random() * 90000) + 10000}`;
  }
  else if (['AU', 'BR', 'IN'].includes(country)) {
    // Countries with 4-digit postal codes
    return `${Math.floor(Math.random() * 9000) + 1000}`;
  }
  else if (['JP', 'KR'].includes(country)) {
    // Japan and South Korea with XXX-XXXX format
    const first = Math.floor(Math.random() * 900) + 100;
    const second = Math.floor(Math.random() * 9000) + 1000;
    return `${first}-${second}`;
  }
  else if (['CN'].includes(country)) {
    // China with 6-digit postal codes
    return `${Math.floor(Math.random() * 900000) + 100000}`;
  }
  else {
    // Default to 5-digit postal code
    return `${Math.floor(Math.random() * 90000) + 10000}`;
  }
}

function generateRandomDate() {
  const start = new Date(1970, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0];
}

function generateCompanyName(country: string) {
  const prefixes = ['Global', 'International', 'National', 'Regional', 'Local', 'Tech', 'Innovative', 'Advanced', 'Modern', 'Premium'];
  const suffixes = ['Solutions', 'Technologies', 'Enterprises', 'Systems', 'Group', 'Industries', 'Holdings', 'Services', 'Ventures', 'Partners'];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const name = `${prefix} ${suffix}`;

  return name;
}

function getRandomIndustry() {
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Transportation', 'Energy', 'Telecommunications', 'Agriculture',
    'Construction', 'Hospitality', 'Entertainment', 'Media', 'Pharmaceuticals',
  ];

  return industries[Math.floor(Math.random() * industries.length)];
}

function convertToCSV(data: any[]) {
  if (!data || data.length === 0) { return ''; }

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      return `"${String(value).replace(/"/g, '""')}"`; // Escape quotes
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

// Copy functionality
const { copy } = useCopy({ source: generatedData, text: 'Data copied to the clipboard' });

function copyData() {
  if (generatedData.value) {
    copy();
  }
}

function downloadData() {
  if (!generatedData.value) { return; }

  const blob = new Blob([generatedData.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `country-data-${Date.now()}.${form.value.format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div>
    <c-card>
      <n-form ref="formRef" :model="form" :rules="rules">
        <n-form-item :label="$t('tools.country-data-generator.labels.country')" path="country" :show-feedback="false" label-width="120" label-placement="left">
          <n-select
            v-model:value="form.country"
            :options="countryOptions"
            :filter="fuzzyFilter"
            :placeholder="$t('tools.country-data-generator.placeholders.selectCountry')"
            filterable
          />
        </n-form-item>

        <n-form-item :label="$t('tools.country-data-generator.labels.dataType')" path="dataType" :show-feedback="false" label-width="120" label-placement="left">
          <n-radio-group v-model:value="form.dataType" default-value="personal">
            <n-space>
              <n-radio value="personal" :label="$t('tools.country-data-generator.options.personal')" />
              <n-radio value="company" :label="$t('tools.country-data-generator.options.company')" />
            </n-space>
          </n-radio-group>
        </n-form-item>

        <n-form-item :label="$t('tools.country-data-generator.labels.recordCount')" path="recordCount" :show-feedback="false" label-width="120" label-placement="left">
          <n-input-number v-model:value="form.recordCount" :min="1" :max="100" />
        </n-form-item>

        <n-form-item :label="$t('tools.country-data-generator.labels.format')" path="format" :show-feedback="false" label-width="120" label-placement="left">
          <n-radio-group v-model:value="form.format">
            <n-radio value="json">
              {{ $t('tools.country-data-generator.formats.json') }}
            </n-radio>
            <n-radio value="csv">
              {{ $t('tools.country-data-generator.formats.csv') }}
            </n-radio>
            <n-radio value="table">
              {{ $t('tools.country-data-generator.formats.table') }}
            </n-radio>
          </n-radio-group>
        </n-form-item>

        <div mt-4 flex justify-center gap-3>
          <c-button type="primary" :loading="isGenerating" @click="generateData">
            {{ $t('tools.country-data-generator.buttons.generateData') }}
          </c-button>
          <c-button :disabled="!generatedData" @click="copyData">
            {{ $t('tools.country-data-generator.buttons.copy') }}
          </c-button>
          <c-button :disabled="!generatedData" @click="downloadData">
            {{ $t('tools.country-data-generator.buttons.download') }}
          </c-button>
        </div>
      </n-form>

      <div v-if="generatedData" mt-6>
        <div v-if="form.format === 'table'" class="data-table">
          <table w-full border-collapse border border-gray-300>
            <thead bg-gray-100>
              <tr>
                <th v-for="header in tableHeaders" :key="header" min-w-100px border border-gray-300 p-2 text-left>
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in tableData" :key="index" hover:bg-gray-50>
                <td v-for="header in tableHeaders" :key="header" max-w-200px break-words border border-gray-300 p-2>
                  {{ row[header] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <c-input-text
          v-else
          :value="generatedData"
          multiline
          :placeholder="$t('tools.country-data-generator.placeholders.generatedData')"
          readonly
          rows="15"
          :class="form.format === 'json' ? 'font-mono' : ''"
        />
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.data-table {
  overflow-x: auto;

  table {
    min-width: 100%;
  }

  th, td {
    padding: 8px 12px;
  }
}
</style>
