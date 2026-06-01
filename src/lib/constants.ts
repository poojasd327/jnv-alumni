export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
] as const

// JNV schools organized by state - representative sample
// In production, this would be fetched from a database or a comprehensive list
export const JNV_SCHOOLS: Record<string, string[]> = {
  "Andhra Pradesh": ["JNV Anantapur", "JNV Chittoor", "JNV East Godavari", "JNV Guntur", "JNV Kadapa", "JNV Krishna", "JNV Kurnool", "JNV Nellore", "JNV Prakasam", "JNV Srikakulam", "JNV Visakhapatnam", "JNV Vizianagaram", "JNV West Godavari"],
  "Arunachal Pradesh": ["JNV Changlang", "JNV East Kameng", "JNV East Siang", "JNV Lohit", "JNV Lower Subansiri", "JNV Papum Pare", "JNV Tawang", "JNV Tirap", "JNV Upper Subansiri", "JNV West Kameng", "JNV West Siang"],
  "Assam": ["JNV Barpeta", "JNV Bongaigaon", "JNV Cachar", "JNV Darrang", "JNV Dhemaji", "JNV Dhubri", "JNV Dibrugarh", "JNV Goalpara", "JNV Golaghat", "JNV Hailakandi", "JNV Jorhat", "JNV Kamrup", "JNV Karbi Anglong", "JNV Karimganj", "JNV Kokrajhar", "JNV Lakhimpur", "JNV Marigaon", "JNV Nagaon", "JNV Nalbari", "JNV North Cachar Hills", "JNV Sibsagar", "JNV Sonitpur", "JNV Tinsukia"],
  "Bihar": ["JNV Araria", "JNV Aurangabad", "JNV Banka", "JNV Begusarai", "JNV Bhagalpur", "JNV Bhojpur", "JNV Buxar", "JNV Darbhanga", "JNV Gaya", "JNV Gopalganj", "JNV Jamui", "JNV Jehanabad", "JNV Kaimur", "JNV Katihar", "JNV Khagaria", "JNV Kishanganj", "JNV Lakhisarai", "JNV Madhepura", "JNV Madhubani", "JNV Munger", "JNV Muzaffarpur", "JNV Nalanda", "JNV Nawada", "JNV Pashchim Champaran", "JNV Patna", "JNV Purba Champaran", "JNV Purnia", "JNV Rohtas", "JNV Saharsa", "JNV Samastipur", "JNV Saran", "JNV Sheikhpura", "JNV Sheohar", "JNV Sitamarhi", "JNV Siwan", "JNV Supaul", "JNV Vaishali"],
  "Chhattisgarh": ["JNV Bastar", "JNV Bilaspur", "JNV Dantewada", "JNV Dhamtari", "JNV Durg", "JNV Janjgir-Champa", "JNV Jashpur", "JNV Kanker", "JNV Kawardha", "JNV Korba", "JNV Koriya", "JNV Mahasamund", "JNV Raigarh", "JNV Raipur", "JNV Rajnandgaon", "JNV Surguja"],
  "Goa": ["JNV North Goa", "JNV South Goa"],
  "Gujarat": ["JNV Ahmedabad", "JNV Amreli", "JNV Anand", "JNV Banaskantha", "JNV Bharuch", "JNV Bhavnagar", "JNV Dahod", "JNV Gandhinagar", "JNV Jamnagar", "JNV Junagadh", "JNV Kachchh", "JNV Kheda", "JNV Mehsana", "JNV Narmada", "JNV Navsari", "JNV Panchmahal", "JNV Patan", "JNV Porbandar", "JNV Rajkot", "JNV Sabarkantha", "JNV Surat", "JNV Surendranagar", "JNV Tapi", "JNV Vadodara", "JNV Valsad"],
  "Haryana": ["JNV Ambala", "JNV Bhiwani", "JNV Faridabad", "JNV Fatehabad", "JNV Gurgaon", "JNV Hisar", "JNV Jhajjar", "JNV Jind", "JNV Kaithal", "JNV Karnal", "JNV Kurukshetra", "JNV Mahendragarh", "JNV Panchkula", "JNV Panipat", "JNV Rewari", "JNV Rohtak", "JNV Sirsa", "JNV Sonipat", "JNV Yamunanagar"],
  "Himachal Pradesh": ["JNV Bilaspur", "JNV Chamba", "JNV Hamirpur", "JNV Kangra", "JNV Kinnaur", "JNV Kullu", "JNV Lahaul and Spiti", "JNV Mandi", "JNV Shimla", "JNV Sirmaur", "JNV Solan", "JNV Una"],
  "Jharkhand": ["JNV Bokaro", "JNV Chatra", "JNV Deoghar", "JNV Dhanbad", "JNV Dumka", "JNV East Singhbhum", "JNV Garhwa", "JNV Giridih", "JNV Godda", "JNV Gumla", "JNV Hazaribagh", "JNV Koderma", "JNV Latehar", "JNV Lohardaga", "JNV Pakur", "JNV Palamu", "JNV Ranchi", "JNV Sahebganj", "JNV Seraikela Kharsawan", "JNV Simdega", "JNV West Singhbhum"],
  "Karnataka": ["JNV Bagalkot", "JNV Bangalore Rural", "JNV Bangalore Urban", "JNV Belgaum", "JNV Bellary", "JNV Bidar", "JNV Bijapur", "JNV Chamarajanagar", "JNV Chikballapur", "JNV Chikmagalur", "JNV Chitradurga", "JNV Dakshina Kannada", "JNV Davanagere", "JNV Dharwad", "JNV Gadag", "JNV Gulbarga", "JNV Hassan", "JNV Haveri", "JNV Kodagu", "JNV Kolar", "JNV Koppal", "JNV Mandya", "JNV Mysore", "JNV Raichur", "JNV Ramanagara", "JNV Shimoga", "JNV Tumkur", "JNV Udupi", "JNV Uttara Kannada", "JNV Yadgir"],
  "Kerala": ["JNV Alappuzha", "JNV Ernakulam", "JNV Idukki", "JNV Kannur", "JNV Kasaragod", "JNV Kollam", "JNV Kottayam", "JNV Kozhikode", "JNV Malappuram", "JNV Palakkad", "JNV Pathanamthitta", "JNV Thiruvananthapuram", "JNV Thrissur", "JNV Wayanad"],
  "Madhya Pradesh": ["JNV Balaghat", "JNV Barwani", "JNV Betul", "JNV Bhind", "JNV Bhopal", "JNV Chhatarpur", "JNV Chhindwara", "JNV Damoh", "JNV Datia", "JNV Dewas", "JNV Dhar", "JNV Dindori", "JNV Guna", "JNV Gwalior", "JNV Harda", "JNV Hoshangabad", "JNV Indore", "JNV Jabalpur", "JNV Jhabua", "JNV Katni", "JNV Khandwa", "JNV Khargone", "JNV Mandla", "JNV Mandsaur", "JNV Morena", "JNV Narsinghpur", "JNV Neemuch", "JNV Panna", "JNV Raisen", "JNV Rajgarh", "JNV Ratlam", "JNV Rewa", "JNV Sagar", "JNV Satna", "JNV Sehore", "JNV Seoni", "JNV Shahdol", "JNV Shajapur", "JNV Sheopur", "JNV Shivpuri", "JNV Sidhi", "JNV Tikamgarh", "JNV Ujjain", "JNV Umaria", "JNV Vidisha"],
  "Maharashtra": ["JNV Ahmednagar", "JNV Akola", "JNV Amravati", "JNV Aurangabad", "JNV Beed", "JNV Bhandara", "JNV Buldhana", "JNV Chandrapur", "JNV Dhule", "JNV Gadchiroli", "JNV Gondia", "JNV Hingoli", "JNV Jalgaon", "JNV Jalna", "JNV Kolhapur", "JNV Latur", "JNV Mumbai Suburban", "JNV Nagpur", "JNV Nanded", "JNV Nandurbar", "JNV Nashik", "JNV Osmanabad", "JNV Parbhani", "JNV Pune", "JNV Raigad", "JNV Ratnagiri", "JNV Sangli", "JNV Satara", "JNV Sindhudurg", "JNV Solapur", "JNV Thane", "JNV Wardha", "JNV Washim", "JNV Yavatmal"],
  "Manipur": ["JNV Bishnupur", "JNV Chandel", "JNV Churachandpur", "JNV Imphal East", "JNV Imphal West", "JNV Senapati", "JNV Tamenglong", "JNV Thoubal", "JNV Ukhrul"],
  "Meghalaya": ["JNV East Garo Hills", "JNV East Khasi Hills", "JNV Jaintia Hills", "JNV Ri-Bhoi", "JNV South Garo Hills", "JNV West Garo Hills", "JNV West Khasi Hills"],
  "Mizoram": ["JNV Aizawl", "JNV Champhai", "JNV Kolasib", "JNV Lawngtlai", "JNV Lunglei", "JNV Mamit", "JNV Saiha", "JNV Serchhip"],
  "Nagaland": ["JNV Dimapur", "JNV Kohima", "JNV Mokokchung", "JNV Mon", "JNV Phek", "JNV Tuensang", "JNV Wokha", "JNV Zunheboto"],
  "Odisha": ["JNV Angul", "JNV Balangir", "JNV Baleshwar", "JNV Bargarh", "JNV Bhadrak", "JNV Boudh", "JNV Cuttack", "JNV Deogarh", "JNV Dhenkanal", "JNV Gajapati", "JNV Ganjam", "JNV Jagatsinghpur", "JNV Jajpur", "JNV Jharsuguda", "JNV Kalahandi", "JNV Kandhamal", "JNV Kendrapara", "JNV Keonjhar", "JNV Khordha", "JNV Koraput", "JNV Malkangiri", "JNV Mayurbhanj", "JNV Nabarangpur", "JNV Nayagarh", "JNV Nuapada", "JNV Puri", "JNV Rayagada", "JNV Sambalpur", "JNV Subarnapur", "JNV Sundargarh"],
  "Punjab": ["JNV Amritsar", "JNV Barnala", "JNV Bathinda", "JNV Faridkot", "JNV Fatehgarh Sahib", "JNV Firozpur", "JNV Gurdaspur", "JNV Hoshiarpur", "JNV Jalandhar", "JNV Kapurthala", "JNV Ludhiana", "JNV Mansa", "JNV Moga", "JNV Muktsar", "JNV Nawanshahr", "JNV Patiala", "JNV Rupnagar", "JNV Sangrur", "JNV Tarn Taran"],
  "Rajasthan": ["JNV Ajmer", "JNV Alwar", "JNV Banswara", "JNV Baran", "JNV Barmer", "JNV Bharatpur", "JNV Bhilwara", "JNV Bikaner", "JNV Bundi", "JNV Chittorgarh", "JNV Churu", "JNV Dausa", "JNV Dholpur", "JNV Dungarpur", "JNV Ganganagar", "JNV Hanumangarh", "JNV Jaipur", "JNV Jaisalmer", "JNV Jalore", "JNV Jhalawar", "JNV Jhunjhunu", "JNV Jodhpur", "JNV Karauli", "JNV Kota", "JNV Nagaur", "JNV Pali", "JNV Pratapgarh", "JNV Rajsamand", "JNV Sawai Madhopur", "JNV Sikar", "JNV Sirohi", "JNV Tonk", "JNV Udaipur"],
  "Sikkim": ["JNV East Sikkim", "JNV North Sikkim", "JNV South Sikkim", "JNV West Sikkim"],
  "Tamil Nadu": ["JNV Coimbatore", "JNV Cuddalore", "JNV Dharmapuri", "JNV Dindigul", "JNV Erode", "JNV Kanchipuram", "JNV Kanyakumari", "JNV Karur", "JNV Krishnagiri", "JNV Madurai", "JNV Nagapattinam", "JNV Namakkal", "JNV Nilgiris", "JNV Perambalur", "JNV Pudukkottai", "JNV Ramanathapuram", "JNV Salem", "JNV Sivagangai", "JNV Thanjavur", "JNV Theni", "JNV Tiruchirappalli", "JNV Tirunelveli", "JNV Tiruvannamalai", "JNV Tuticorin", "JNV Vellore", "JNV Villupuram", "JNV Virudhunagar"],
  "Telangana": ["JNV Adilabad", "JNV Hyderabad", "JNV Karimnagar", "JNV Khammam", "JNV Mahabubnagar", "JNV Medak", "JNV Nalgonda", "JNV Nizamabad", "JNV Rangareddy", "JNV Warangal"],
  "Tripura": ["JNV Dhalai", "JNV North Tripura", "JNV South Tripura", "JNV West Tripura"],
  "Uttar Pradesh": ["JNV Agra", "JNV Aligarh", "JNV Allahabad", "JNV Ambedkar Nagar", "JNV Amethi", "JNV Auraiya", "JNV Azamgarh", "JNV Baghpat", "JNV Bahraich", "JNV Ballia", "JNV Balrampur", "JNV Banda", "JNV Barabanki", "JNV Bareilly", "JNV Basti", "JNV Bijnor", "JNV Budaun", "JNV Bulandshahr", "JNV Chandauli", "JNV Chitrakoot", "JNV Deoria", "JNV Etah", "JNV Etawah", "JNV Faizabad", "JNV Farrukhabad", "JNV Fatehpur", "JNV Firozabad", "JNV Gautam Buddha Nagar", "JNV Ghaziabad", "JNV Ghazipur", "JNV Gonda", "JNV Gorakhpur", "JNV Hamirpur", "JNV Hardoi", "JNV Hathras", "JNV Jalaun", "JNV Jaunpur", "JNV Jhansi", "JNV Kannauj", "JNV Kanpur Dehat", "JNV Kanpur Nagar", "JNV Kaushambi", "JNV Kushinagar", "JNV Lakhimpur Kheri", "JNV Lalitpur", "JNV Lucknow", "JNV Maharajganj", "JNV Mahoba", "JNV Mainpuri", "JNV Mathura", "JNV Mau", "JNV Meerut", "JNV Mirzapur", "JNV Moradabad", "JNV Muzaffarnagar", "JNV Pilibhit", "JNV Pratapgarh", "JNV Rae Bareli", "JNV Rampur", "JNV Saharanpur", "JNV Sant Kabir Nagar", "JNV Sant Ravidas Nagar", "JNV Shahjahanpur", "JNV Shravasti", "JNV Siddharthnagar", "JNV Sitapur", "JNV Sonbhadra", "JNV Sultanpur", "JNV Unnao", "JNV Varanasi"],
  "Uttarakhand": ["JNV Almora", "JNV Bageshwar", "JNV Chamoli", "JNV Champawat", "JNV Dehradun", "JNV Haridwar", "JNV Nainital", "JNV Pauri Garhwal", "JNV Pithoragarh", "JNV Rudraprayag", "JNV Tehri Garhwal", "JNV Udham Singh Nagar", "JNV Uttarkashi"],
  "West Bengal": ["JNV Bankura", "JNV Bardhaman", "JNV Birbhum", "JNV Cooch Behar", "JNV Dakshin Dinajpur", "JNV Darjeeling", "JNV Hooghly", "JNV Howrah", "JNV Jalpaiguri", "JNV Malda", "JNV Medinipur East", "JNV Medinipur West", "JNV Murshidabad", "JNV Nadia", "JNV North 24 Parganas", "JNV Purulia", "JNV South 24 Parganas", "JNV Uttar Dinajpur"],
  "Delhi": ["JNV Delhi"],
  "Jammu and Kashmir": ["JNV Anantnag", "JNV Baramulla", "JNV Budgam", "JNV Doda", "JNV Jammu", "JNV Kathua", "JNV Kupwara", "JNV Leh", "JNV Poonch", "JNV Pulwama", "JNV Rajouri", "JNV Srinagar", "JNV Udhampur"],
  "Chandigarh": ["JNV Chandigarh"],
  "Puducherry": ["JNV Puducherry"],
}

export const INDUSTRIES = [
  "Technology", "Finance & Banking", "Healthcare", "Education",
  "Government & Public Sector", "Agriculture", "Manufacturing",
  "Consulting", "Legal", "Media & Entertainment", "Real Estate",
  "Retail & E-commerce", "Telecom", "Energy & Utilities",
  "Transportation & Logistics", "Hospitality", "Defence",
  "Non-Profit & NGO", "Entrepreneurship", "Other",
] as const

export const MARKETPLACE_CATEGORIES = [
  { name: "Electronics", slug: "electronics", icon: "Smartphone" },
  { name: "Vehicles", slug: "vehicles", icon: "Car" },
  { name: "Real Estate", slug: "real-estate", icon: "Home" },
  { name: "Agriculture", slug: "agriculture", icon: "Wheat" },
  { name: "Services", slug: "services", icon: "Briefcase" },
] as const

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Directory", href: "/directory", icon: "Users" },
  { label: "Marketplace", href: "/marketplace", icon: "ShoppingBag" },
  { label: "Jobs", href: "/jobs", icon: "Briefcase" },
  { label: "Events", href: "/events", icon: "Calendar" },
  { label: "Forum", href: "/forum", icon: "MessageSquare" },
  { label: "Announcements", href: "/announcements", icon: "Megaphone" },
  { label: "Businesses", href: "/businesses", icon: "Building2" },
  { label: "Media", href: "/media", icon: "ImageIcon" },
  { label: "Mentorship", href: "/mentorship", icon: "HandHelping" },
] as const

export const PERSONAL_NAV_ITEMS = [
  { label: "Messages", href: "/messages", icon: "Mail" },
  { label: "My Listings", href: "/marketplace/my-listings", icon: "Package" },
  { label: "Wishlist", href: "/wishlist", icon: "Heart" },
  { label: "Profile", href: "/profile", icon: "User" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const

export const ADMIN_NAV_ITEMS = [
  { label: "Approvals", href: "/admin", icon: "UserCheck" },
  { label: "All Users", href: "/admin/users", icon: "UsersRound" },
  { label: "Reports", href: "/admin/reports", icon: "Flag" },
] as const

export const LISTING_CONDITIONS = [
  { value: "new", label: "Brand New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
] as const

export const BUSINESS_CATEGORIES = [
  "Technology", "Agriculture", "Real Estate", "Manufacturing", "Consulting",
  "Education", "Healthcare", "Retail", "Finance", "Transportation",
  "Hospitality", "Legal", "Other",
] as const

export const MEDIA_CATEGORIES = [
  "School Life", "Reunions", "Events", "Achievements", "Sports", "Cultural", "Other",
] as const

export const MENTORSHIP_AREAS = [
  "Career Guidance", "UPSC", "Software Engineering", "MBA", "Startups",
  "Government Jobs", "Agriculture", "Finance", "Healthcare", "Other",
] as const

export const JOB_TYPES = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
] as const
