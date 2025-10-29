// Sova Testnet Configuration
export const SOVA_CHAIN = {
  id: 120893,
  name: 'Sova Testnet',
  network: 'sova-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sova',
    symbol: 'SOVA',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.sova.io'],
    },
    public: {
      http: ['https://rpc.testnet.sova.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Sova Explorer',
      url: 'https://explorer.testnet.sova.io',
    },
  },
  testnet: true,
} as const;

// Contract Address
export const CONTRACT_ADDRESS = '0xD749D9Aff970082dd0910dF5af09b588a07F7ddd' as const;

// Submit fee: 0.0666 ETH
export const SUBMIT_FEE = BigInt('66600000000000000'); // 0.0666 ETH in wei

// All countries list
export const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria',
  'Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
  'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia',
  'Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo (Congo-Brazzaville)','Costa Rica',
  'Cote d’Ivoire','Croatia','Cuba','Cyprus','Czechia (Czech Republic)','Democratic Republic of the Congo','Denmark','Djibouti','Dominica','Dominican Republic',
  'Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini (fmr. "Swaziland")','Ethiopia','Fiji','Finland',
  'France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea',
  'Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq',
  'Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Korea, North',
  'Korea, South','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein',
  'Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania',
  'Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar (Burma)',
  'Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Macedonia','Norway',
  'Oman','Pakistan','Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal',
  'Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe',
  'Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia',
  'South Africa','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan',
  'Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan',
  'Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Vatican City',
  'Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Palestine'
] as const;

// ABI
export const EARTH_CLICK_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "username", "type": "string"}, {"internalType": "string", "name": "country", "type": "string"}],
    "name": "register",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "points", "type": "uint256"}],
    "name": "submitPoints",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserInfo",
    "outputs": [
      {"internalType": "string", "name": "username", "type": "string"},
      {"internalType": "string", "name": "country", "type": "string"},
      {"internalType": "uint256", "name": "totalPoints", "type": "uint256"},
      {"internalType": "uint256", "name": "pendingPointsCount", "type": "uint256"},
      {"internalType": "uint256", "name": "lastSubmitTimestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "limit", "type": "uint256"}],
    "name": "getCountryLeaderboard",
    "outputs": [
      {"internalType": "string[]", "name": "countryNames", "type": "string[]"},
      {"internalType": "uint256[]", "name": "countryPoints", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "country", "type": "string"}, {"internalType": "uint256", "name": "limit", "type": "uint256"}],
    "name": "getTopPlayersInCountry",
    "outputs": [
      {"internalType": "address[]", "name": "playerAddresses", "type": "address[]"},
      {"internalType": "string[]", "name": "usernames", "type": "string[]"},
      {"internalType": "uint256[]", "name": "playerPoints", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllCountries",
    "outputs": [
      {"internalType": "string[]", "name": "countryNames", "type": "string[]"},
      {"internalType": "uint256[]", "name": "countryPoints", "type": "uint256[]"},
      {"internalType": "uint256[]", "name": "countryPlayers", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "users",
    "outputs": [
      {"internalType": "string", "name": "username", "type": "string"},
      {"internalType": "string", "name": "country", "type": "string"},
      {"internalType": "uint256", "name": "totalPoints", "type": "uint256"},
      {"internalType": "uint256", "name": "lastSubmitTimestamp", "type": "uint256"},
      {"internalType": "bool", "name": "registered", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

