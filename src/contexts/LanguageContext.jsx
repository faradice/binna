import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  is: {
    // Navigation
    nav: {
      yfirlit: 'Yfirlit',
      skolar: 'Skólar',
      nemendur: 'Nemendur',
      adstandendur: 'Aðstandendur',
      starfsmenn: 'Starfsmenn',
      vinnuskyrslur: 'Vinnuskýrslur',
      astundun: 'Ástundun',
      fjoldapostur: 'Fjöldapóstur',
      frettir: 'Fréttir',
      notendur: 'Notendur',
    },
    // Authentication
    auth: {
      login: 'Innskráning',
      logout: 'Útskráning',
      username: 'Notandanafn',
      usernamePlaceholder: 'Sláðu inn notandanafn',
      password: 'Lykilorð',
      invalidCredentials: 'Rangt notandanafn eða lykilorð',
      accessDenied: 'Aðgangur bannaður',
      noPermission: 'Þú hefur ekki heimild til að skoða þessa síðu. Hafðu samband við kerfisstjóra ef þú telur þetta vera villu.',
      // User management
      userManagement: 'Notendastjórnun',
      userManagementDesc: 'Stjórna notendum og aðgangsheimildum',
      createUser: 'Búa til notanda',
      editUser: 'Breyta notanda',
      searchUsers: 'Leita að notanda...',
      name: 'Nafn',
      namePlaceholder: 'Fullt nafn',
      email: 'Netfang',
      role: 'Hlutverk',
      status: 'Staða',
      lastLogin: 'Síðasta innskráning',
      actions: 'Aðgerðir',
      active: 'Virkur',
      inactive: 'Óvirkur',
      activeUser: 'Virkur notandi',
      edit: 'Breyta',
      delete: 'Eyða',
      activate: 'Virkja',
      deactivate: 'Óvirkja',
      cancel: 'Hætta við',
      saveChanges: 'Vista breytingar',
      noUsersFound: 'Engir notendur fundust',
      confirmDelete: 'Eyða notanda?',
      confirmDeleteDesc: 'Ertu viss um að þú viljir eyða þessum notanda? Þessa aðgerð er ekki hægt að afturkalla.',
      // Password
      changePassword: 'Breyta lykilorði',
      currentPassword: 'Núverandi lykilorð',
      newPassword: 'Nýtt lykilorð',
      confirmPassword: 'Staðfesta lykilorð',
      passwordChanged: 'Lykilorði breytt!',
      passwordsDoNotMatch: 'Lykilorðin stemma ekki',
      passwordTooShort: 'Lykilorð verður að vera að minnsta kosti 6 stafir',
      wrongPassword: 'Rangt lykilorð',
      leaveBlankToKeep: 'Skildu eftir autt til að halda núverandi lykilorði',
      passwordRequired: 'Lykilorð er nauðsynlegt',
      // Errors
      allFieldsRequired: 'Allir reitir eru nauðsynlegir',
      usernameExists: 'Notandanafn er þegar til',
      errorOccurred: 'Villa kom upp. Reyndu aftur.',
      // Roles
      roles: {
        admin: 'Kerfisstjóri',
        starfsmannastjori: 'Starfsmannastjóri',
        skolaskrifstofa: 'Skólaskrifstofa',
        samskipti: 'Samskiptastjóri',
      },
    },
    // Common
    common: {
      leita: 'Leita',
      leitaAd: 'Leita að',
      sia: 'Sía',
      hreinsa: 'Hreinsa',
      alpirsiu: 'Hreinsa allar síur',
      allt: 'Allt',
      flyjaUt: 'Flytja út',
      flyjaUtAllt: 'Flytja út allt',
      valdir: 'valdir',
      veljaAlla: 'Velja alla',
      faerslur: 'færslum',
      af: 'af',
      allirSkolar: 'Allir skólar',
      sveitarfelag: 'Sveitarfélag',
      // Export
      fyrirExcel: 'Fyrir Excel / Power BI',
      excelSkjal: 'Excel skjal',
    },
    // Dashboard
    dashboard: {
      titill: 'Yfirlit',
      lysing: 'Samantekt á skólum sveitarfélagsins',
      heildarfjoldiNemenda: 'Heildarfjöldi nemenda',
      heildarfjoldiStarfsmanna: 'Heildarfjöldi starfsmanna',
      fjoldiSkola: 'Fjöldi skóla',
      medaltalsstaerd: 'Meðaltalsst. skóla',
    },
    // Schools
    skolar: {
      titill: 'Skólar',
      lysing: 'Allir skólar sveitarfélagsins',
      nafn: 'Nafn',
      nemendafjoldi: 'Nemendafj.',
      starfsmannafjoldi: 'Starfsmennfj.',
      rekstraradili: 'Rekstraraðili',
      heimilisfang: 'Heimilisfang',
      postnumer: 'Póstnúmer',
      simi: 'Símanúmer',
      skolastjori: 'Skólastjóri',
      netfang: 'Netfang',
      // New for class/group view
      veljaSkola: 'Velja skóla',
      argangar: 'Árgangar',
      bekkir: 'Bekkir',
      hopar: 'Hópar',
      bekkur: 'Bekkur',
      hopur: 'Hópur',
      argangur: 'Árgangur',
      nempidarIBekk: 'Nemendur í bekk',
      nempidarIHop: 'Nemendur í hóp',
      engirNempidar: 'Engir nemendur',
      engirBekkir: 'Engir bekkir eða hópar',
      skoliValinn: 'skóli valinn',
      skolarValdir: 'skólar valdir',
      loka: 'Loka',
    },
    // Students
    nemendur: {
      titill: 'Nemendur',
      lysing: 'Allir nemendur í skólum sveitarfélagsins',
      leitaAdNemanda: 'Leita að nemanda...',
      kennitala: 'Kennitala',
      nafn: 'Nafn',
      heimili: 'Heimili',
      netfang: 'Netfang',
      skoli: 'Skóli',
      kyn: 'Kyn',
      argangur: 'Árgangur',
      sveitarfelag: 'Sveitarfélag',
      // Tabs
      allir: 'Allir',
      iHeimasveitarfelagi: 'Í heimasveitarfélagi',
      iSkolaAnnarsStadar: 'Í skóla annars staðar',
      urOdruSveitarfelagi: 'Úr öðru sveitarfélagi',
    },
    // Guardians
    adstandendur: {
      titill: 'Aðstandendur',
      lysing: 'Foreldrar og forráðamenn nemenda',
      leitaAdAdstandanda: 'Leita að aðstandanda...',
      kennitala: 'Kennitala',
      nafn: 'Nafn',
      heimili: 'Heimili',
      netfang: 'Netfang',
      simi: 'Símanúmer',
      tengsl: 'Tengsl',
      forsja: 'Forsjá',
      adaltengilidir: 'Aðaltengiliður',
      farsimi: 'Farsími',
      vinnustadur: 'Vinnustaður',
      vinnusimi: 'Vinnusími',
      nempidar: 'Barn',
    },
    // Staff
    starfsmenn: {
      titill: 'Starfsmenn',
      lysing: 'Allir starfsmenn í skólum sveitarfélagsins',
      leitaAdStarfsmanni: 'Leita að starfsmanni...',
      kennitala: 'Kennitala',
      nafn: 'Nafn',
      heimili: 'Heimili',
      netfang: 'Netfang',
      simi: 'Símanúmer',
      skoli: 'Skóli',
      deild: 'Deild',
      starfshlutfall: 'Starfshlutfall',
      menntun: 'Menntun',
      radningardagur: 'Ráðningardagur',
      farsimi: 'Farsími',
    },
    // Work reports
    vinnuskyrslur: {
      titill: 'Vinnuskýrslur',
      lysing: 'Launaupplýsingar starfsmanna úr skólum',
      leitaIVinnuskyrslu: 'Leita í vinnuskýrslum...',
      synaDalkaflokka: 'Sýna dálkaflokka:',
      // Column groups
      grunnupplysingar: 'Grunnupplýsingar',
      radningOgLaun: 'Ráðning og laun',
      menntunOgReynsla: 'Menntun og reynsla',
      kennsla: 'Kennsla',
      yfirvinna: 'Yfirvinna',
    },
    // Attendance
    astundun: {
      titill: 'Ástundun',
      lysing: 'Fjarvistir, seint, leyfi og veikindi nemenda',
      leitaAdNemanda: 'Leita að nemanda...',
      nafn: 'Nafn',
      kennitala: 'Kennitala',
      skoli: 'Skóli',
      argangur: 'Árgangur',
      manudur: 'Mánuður',
      fjarvistir: 'Fjarvistir',
      seint: 'Seint',
      leyfi: 'Leyfi',
      veikindi: 'Veikindi',
      kennslustundir: 'Kennslust.',
      maett: 'Mætt',
      fjarveraProsen: 'Raunmæting %',
      // Stats
      nempidar: 'Nemendur',
      medaltalNem: 'Meðaltal/nem.',
      flaggadir: 'Flaggaðir (>10%)',
      synaFlaggada: 'Sýna flaggaða',
      flaggadirBtn: 'Flaggaðir',
      // Views
      tafla: 'Tafla',
      grof: 'Gröf',
      // Charts
      eftirSkolum: 'Eftir skólum',
      eftirManudum: 'Eftir mánuðum',
      hlutfoll: 'Hlutföll',
      samantektEftirSkolum: 'Samantekt eftir skólum',
      samtals: 'Samtals',
    },
    // Mass email
    postur: {
      titill: 'Fjöldapóstur',
      lysing: 'Senda tölvupóst til starfsmanna, foreldra eða nemenda',
      sendaPosta: 'Senda póst',
      // Steps
      veljaViditakendur: 'Velja viðtakendur',
      skrifaPosta: 'Skrifa póst',
      // Recipient types
      viditakendategund: 'Viðtakendategund',
      starfsmenn: 'Starfsmenn',
      adstandendur: 'Aðstandendur',
      nempidarYfir18: 'Nemendur (yfir 18 ára)',
      // Selection
      veljaSkola: 'Velja skóla',
      veljaArganga: 'Velja árganga',
      allirArgangar: 'Allir árgangar',
      // Email
      efni: 'Efni',
      efniPlaceholder: 'Sláðu inn efnislínu...',
      texti: 'Texti',
      vidhengi: 'Viðhengi',
      baetaVidVidhengi: 'Bæta við viðhengi',
      engaVidhengi: 'Engin viðhengi valin',
      viditakpidar: 'viðtakendur',
    },
    // Export
    export: {
      flytjaUt: 'Flytja út',
      allirNempidar: 'Allir nemendur',
      bekkjafjoldi: 'Fjöldi eftir bekkjum',
      kynjaskipting: 'Kynjaskipting',
      fjoldi: 'Fjöldi',
      drpigar: 'Drengir',
      stulkur: 'Stúlkur',
      pirar: 'Annað',
      pisamtals: 'Samtals',
    },
    // Fréttir
    frettir: {
      titill: 'Fréttir',
      lysing: 'Senda fréttir til skóla',
      nyFrett: 'Ný frétt',
      titillFrettar: 'Titill',
      titillPlaceholder: 'Sláðu inn titil fréttarinnar...',
      gildirFra: 'Gildir frá',
      gildirTil: 'Gildir til',
      gildir: 'Gildir',
      veljaSkola: 'Velja skóla',
      allirSkolar: 'Allir skólar',
      titilmynd: 'Titilmynd',
      veljaMynd: 'Velja mynd',
      efni: 'Efni',
      efniPlaceholder: 'Skrifaðu fréttina hér...',
      vidhengi: 'Viðhengi',
      baetaVidVidhengi: 'Bæta við viðhengi',
      birta: 'Birta frétt',
      skotha: 'Skoða',
      engarFrettir: 'Engar fréttir hafa verið birtar',
    },
  },
  en: {
    // Navigation
    nav: {
      yfirlit: 'Overview',
      skolar: 'Schools',
      nemendur: 'Students',
      adstandendur: 'Guardians',
      starfsmenn: 'Staff',
      vinnuskyrslur: 'Work Reports',
      astundun: 'Attendance',
      fjoldapostur: 'Mass Email',
      frettir: 'News',
      notendur: 'Users',
    },
    // Authentication
    auth: {
      login: 'Log in',
      logout: 'Log out',
      username: 'Username',
      usernamePlaceholder: 'Enter username',
      password: 'Password',
      invalidCredentials: 'Invalid username or password',
      accessDenied: 'Access Denied',
      noPermission: 'You do not have permission to view this page. Contact an administrator if you believe this is an error.',
      // User management
      userManagement: 'User Management',
      userManagementDesc: 'Manage users and access permissions',
      createUser: 'Create User',
      editUser: 'Edit User',
      searchUsers: 'Search users...',
      name: 'Name',
      namePlaceholder: 'Full name',
      email: 'Email',
      role: 'Role',
      status: 'Status',
      lastLogin: 'Last Login',
      actions: 'Actions',
      active: 'Active',
      inactive: 'Inactive',
      activeUser: 'Active user',
      edit: 'Edit',
      delete: 'Delete',
      activate: 'Activate',
      deactivate: 'Deactivate',
      cancel: 'Cancel',
      saveChanges: 'Save Changes',
      noUsersFound: 'No users found',
      confirmDelete: 'Delete user?',
      confirmDeleteDesc: 'Are you sure you want to delete this user? This action cannot be undone.',
      // Password
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      passwordChanged: 'Password changed!',
      passwordsDoNotMatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      wrongPassword: 'Wrong password',
      leaveBlankToKeep: 'Leave blank to keep current password',
      passwordRequired: 'Password is required',
      // Errors
      allFieldsRequired: 'All fields are required',
      usernameExists: 'Username already exists',
      errorOccurred: 'An error occurred. Please try again.',
      // Roles
      roles: {
        admin: 'System Admin',
        starfsmannastjori: 'HR Manager',
        skolaskrifstofa: 'School Office',
        samskipti: 'Communications',
      },
    },
    // Common
    common: {
      leita: 'Search',
      leitaAd: 'Search for',
      sia: 'Filter',
      hreinsa: 'Clear',
      alpirsiu: 'Clear all filters',
      allt: 'All',
      flyjaUt: 'Export',
      flyjaUtAllt: 'Export all',
      valdir: 'selected',
      veljaAlla: 'Select all',
      faerslur: 'entries',
      af: 'of',
      allirSkolar: 'All schools',
      sveitarfelag: 'Municipality',
      // Export
      fyrirExcel: 'For Excel / Power BI',
      excelSkjal: 'Excel file',
    },
    // Dashboard
    dashboard: {
      titill: 'Overview',
      lysing: 'Summary of municipality schools',
      heildarfjoldiNemenda: 'Total students',
      heildarfjoldiStarfsmanna: 'Total staff',
      fjoldiSkola: 'Number of schools',
      medaltalsstaerd: 'Avg. school size',
    },
    // Schools
    skolar: {
      titill: 'Schools',
      lysing: 'All schools in the municipality',
      nafn: 'Name',
      nemendafjoldi: 'Students',
      starfsmannafjoldi: 'Staff',
      rekstraradili: 'Operator',
      heimilisfang: 'Address',
      postnumer: 'Postal code',
      simi: 'Phone',
      skolastjori: 'Principal',
      netfang: 'Email',
      // New for class/group view
      veljaSkola: 'Select schools',
      argangar: 'Grades',
      bekkir: 'Classes',
      hopar: 'Groups',
      bekkur: 'Class',
      hopur: 'Group',
      argangur: 'Grade',
      nempidarIBekk: 'Students in class',
      nempidarIHop: 'Students in group',
      engirNempidar: 'No students',
      engirBekkir: 'No classes or groups',
      skoliValinn: 'school selected',
      skolarValdir: 'schools selected',
      loka: 'Close',
    },
    // Students
    nemendur: {
      titill: 'Students',
      lysing: 'All students in municipality schools',
      leitaAdNemanda: 'Search for student...',
      kennitala: 'ID number',
      nafn: 'Name',
      heimili: 'Address',
      netfang: 'Email',
      skoli: 'School',
      kyn: 'Gender',
      argangur: 'Grade',
      sveitarfelag: 'Municipality',
      // Tabs
      allir: 'All',
      iHeimasveitarfelagi: 'In home municipality',
      iSkolaAnnarsStadar: 'In school elsewhere',
      urOdruSveitarfelagi: 'From other municipality',
    },
    // Guardians
    adstandendur: {
      titill: 'Guardians',
      lysing: 'Parents and legal guardians of students',
      leitaAdAdstandanda: 'Search for guardian...',
      kennitala: 'ID number',
      nafn: 'Name',
      heimili: 'Address',
      netfang: 'Email',
      simi: 'Phone',
      tengsl: 'Relation',
      forsja: 'Custody',
      adaltengilidir: 'Primary contact',
      farsimi: 'Mobile',
      vinnustadur: 'Workplace',
      vinnusimi: 'Work phone',
      nempidar: 'Child',
    },
    // Staff
    starfsmenn: {
      titill: 'Staff',
      lysing: 'All staff in municipality schools',
      leitaAdStarfsmanni: 'Search for staff member...',
      kennitala: 'ID number',
      nafn: 'Name',
      heimili: 'Address',
      netfang: 'Email',
      simi: 'Phone',
      skoli: 'School',
      deild: 'Department',
      starfshlutfall: 'Employment %',
      menntun: 'Education',
      radningardagur: 'Hire date',
      farsimi: 'Mobile',
    },
    // Work reports
    vinnuskyrslur: {
      titill: 'Work Reports',
      lysing: 'Staff salary information from schools',
      leitaIVinnuskyrslu: 'Search in work reports...',
      synaDalkaflokka: 'Show column groups:',
      // Column groups
      grunnupplysingar: 'Basic info',
      radningOgLaun: 'Employment & salary',
      menntunOgReynsla: 'Education & experience',
      kennsla: 'Teaching',
      yfirvinna: 'Overtime',
    },
    // Attendance
    astundun: {
      titill: 'Attendance',
      lysing: 'Absences, tardiness, leave and illness of students',
      leitaAdNemanda: 'Search for student...',
      nafn: 'Name',
      kennitala: 'ID number',
      skoli: 'School',
      argangur: 'Grade',
      manudur: 'Month',
      fjarvistir: 'Absences',
      seint: 'Late',
      leyfi: 'Leave',
      veikindi: 'Illness',
      kennslustundir: 'Classes',
      maett: 'Attended',
      fjarveraProsen: 'Attendance %',
      // Stats
      nempidar: 'Students',
      medaltalNem: 'Avg/student',
      flaggadir: 'Flagged (>10%)',
      synaFlaggada: 'Show flagged',
      flaggadirBtn: 'Flagged',
      // Views
      tafla: 'Table',
      grof: 'Charts',
      // Charts
      eftirSkolum: 'By school',
      eftirManudum: 'By month',
      hlutfoll: 'Proportions',
      samantektEftirSkolum: 'Summary by schools',
      samtals: 'Total',
    },
    // Mass email
    postur: {
      titill: 'Mass Email',
      lysing: 'Send email to staff, parents or students',
      sendaPosta: 'Send email',
      // Steps
      veljaViditakendur: 'Select recipients',
      skrifaPosta: 'Write email',
      // Recipient types
      viditakendategund: 'Recipient type',
      starfsmenn: 'Staff',
      adstandendur: 'Guardians',
      nempidarYfir18: 'Students (over 18)',
      // Selection
      veljaSkola: 'Select schools',
      veljaArganga: 'Select grades',
      allirArgangar: 'All grades',
      // Email
      efni: 'Subject',
      efniPlaceholder: 'Enter subject line...',
      texti: 'Message',
      vidhengi: 'Attachments',
      baetaVidVidhengi: 'Add attachment',
      engaVidhengi: 'No attachments selected',
      viditakpidar: 'recipients',
    },
    // Export
    export: {
      flytjaUt: 'Export',
      allirNempidar: 'All students',
      bekkjafjoldi: 'Count by class',
      kynjaskipting: 'Gender distribution',
      fjoldi: 'Count',
      drpigar: 'Boys',
      stulkur: 'Girls',
      pirar: 'Other',
      pisamtals: 'Total',
    },
    // News
    frettir: {
      titill: 'News',
      lysing: 'Send news to schools',
      nyFrett: 'New article',
      titillFrettar: 'Title',
      titillPlaceholder: 'Enter article title...',
      gildirFra: 'Valid from',
      gildirTil: 'Valid until',
      gildir: 'Valid',
      veljaSkola: 'Select schools',
      allirSkolar: 'All schools',
      titilmynd: 'Title image',
      veljaMynd: 'Select image',
      efni: 'Content',
      efniPlaceholder: 'Write the article here...',
      vidhengi: 'Attachments',
      baetaVidVidhengi: 'Add attachment',
      birta: 'Publish',
      skotha: 'View',
      engarFrettir: 'No articles have been published',
    },
  },
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('commune-language')
    return saved || 'is'
  })

  useEffect(() => {
    localStorage.setItem('commune-language', language)
  }, [language])

  const t = (path) => {
    const keys = path.split('.')
    let value = translations[language]
    for (const key of keys) {
      value = value?.[key]
    }
    return value || path
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
