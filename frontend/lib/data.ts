import type { Text } from "./i18n";

export type Category = "identity" | "travel" | "money" | "health" | "farm" | "certificate";

export type Service = {
  id: string;
  category: Category;
  title: Text;
  note: Text;
  summary: Text;
  who: Text;
  docs: Text[];
  steps: Text[];
  mistakes: Text[];
  link: { label: string; url: string };
  keywords: string[];
  prompt: Text;
};

export const services: Service[] = [
  {
    id: "pan",
    category: "money",
    title: { en: "PAN card", hi: "पैन कार्ड" },
    note: { en: "New card or corrections", hi: "नया कार्ड या सुधार" },
    summary: {
      en: "PAN is a 10-character ID from the Income Tax Department. You need it to file income tax, open a bank account and make large payments.",
      hi: "पैन आयकर विभाग का 10 अंकों का पहचान नंबर है। इसकी ज़रूरत आयकर रिटर्न भरने, बैंक खाता खोलने और बड़े भुगतान करने में पड़ती है।",
    },
    who: {
      en: "Any Indian citizen. A parent or guardian can apply for a child.",
      hi: "कोई भी भारतीय नागरिक। बच्चे के लिए माता-पिता या अभिभावक आवेदन कर सकते हैं।",
    },
    docs: [
      { en: "Identity proof (Aadhaar is the easiest)", hi: "पहचान का प्रमाण (आधार सबसे आसान है)" },
      { en: "Address proof", hi: "पते का प्रमाण" },
      { en: "Date of birth proof", hi: "जन्म तिथि का प्रमाण" },
      { en: "One recent photo and your signature", hi: "एक हाल की फ़ोटो और आपके हस्ताक्षर" },
    ],
    steps: [
      { en: "Open the official PAN application page on the NSDL or UTIITSL website.", hi: "NSDL या UTIITSL की आधिकारिक वेबसाइट पर पैन आवेदन पेज खोलें।" },
      { en: "Choose new PAN and fill in your details exactly as in your documents.", hi: "नया पैन चुनें और अपनी जानकारी दस्तावेज़ों के अनुसार ही भरें।" },
      { en: "Verify with e-KYC (a code sent to the phone linked to Aadhaar) or upload your documents.", hi: "ई-केवाईसी (आधार से जुड़े फ़ोन पर आए कोड) से सत्यापन करें या दस्तावेज़ अपलोड करें।" },
      { en: "Pay the fee online and save the acknowledgement number.", hi: "फीस ऑनलाइन भरें और रसीद संख्या सुरक्षित रखें।" },
    ],
    mistakes: [
      { en: "Your name does not match your Aadhaar exactly.", hi: "आपका नाम आधार से हू-ब-हू नहीं मिलता।" },
      { en: "A wrong date of birth.", hi: "जन्म तिथि गलत भरना।" },
    ],
    link: { label: "Income Tax portal", url: "https://www.incometax.gov.in" },
    keywords: ["pan", "पैन", "permanent account"],
    prompt: { en: "How do I apply for a PAN card?", hi: "पैन कार्ड के लिए आवेदन कैसे करें?" },
  },
  {
    id: "aadhaar",
    category: "identity",
    title: { en: "Aadhaar update", hi: "आधार अपडेट" },
    note: { en: "Address, phone, name, photo", hi: "पता, फ़ोन, नाम, फ़ोटो" },
    summary: {
      en: "Aadhaar is a 12-digit ID number for every resident. You can update details such as your address, phone number, name or photo.",
      hi: "आधार हर निवासी का 12 अंकों का पहचान नंबर है। आप पता, फ़ोन नंबर, नाम या फ़ोटो जैसी जानकारी अपडेट करा सकते हैं।",
    },
    who: { en: "Any Aadhaar holder.", hi: "कोई भी आधार धारक।" },
    docs: [
      { en: "Your Aadhaar number", hi: "आपका आधार नंबर" },
      { en: "A phone number linked to Aadhaar, to receive a code", hi: "आधार से जुड़ा फ़ोन नंबर, कोड पाने के लिए" },
      { en: "Proof for the detail you are changing, such as address proof", hi: "जो जानकारी बदलनी है उसका प्रमाण, जैसे पते का प्रमाण" },
    ],
    steps: [
      { en: "Open the My Aadhaar portal on the UIDAI website and log in with your Aadhaar number and the code sent to your phone.", hi: "UIDAI वेबसाइट पर My Aadhaar पोर्टल खोलें और आधार नंबर व फ़ोन पर आए कोड से लॉग इन करें।" },
      { en: "Choose the detail you want to update.", hi: "जो जानकारी अपडेट करनी है उसे चुनें।" },
      { en: "Upload the proof document.", hi: "प्रमाण का दस्तावेज़ अपलोड करें।" },
      { en: "Submit and save the update request number.", hi: "जमा करें और अपडेट अनुरोध संख्या सुरक्षित रखें।" },
      { en: "Photo and fingerprint changes need a visit to an Aadhaar centre.", hi: "फ़ोटो और उंगलियों के निशान बदलने के लिए आधार केंद्र जाना पड़ता है।" },
    ],
    mistakes: [
      { en: "The phone number is not linked to Aadhaar, so no code arrives.", hi: "आधार से फ़ोन नंबर जुड़ा नहीं है, इसलिए कोड नहीं आता।" },
      { en: "The proof document is blurry or expired.", hi: "दस्तावेज़ धुंधला या पुराना है।" },
    ],
    link: { label: "My Aadhaar portal (UIDAI)", url: "https://myaadhaar.uidai.gov.in" },
    keywords: ["aadhaar", "aadhar", "adhar", "आधार"],
    prompt: { en: "How do I update my Aadhaar details?", hi: "अपने आधार की जानकारी कैसे अपडेट करूँ?" },
  },
  {
    id: "passport",
    category: "travel",
    title: { en: "Passport", hi: "पासपोर्ट" },
    note: { en: "Apply or renew", hi: "नया या नवीनीकरण" },
    summary: {
      en: "A passport is the official document you need to travel abroad. You apply online, book a visit to a Passport Seva Kendra and the police check your address.",
      hi: "पासपोर्ट विदेश यात्रा के लिए ज़रूरी सरकारी दस्तावेज़ है। आप ऑनलाइन आवेदन करते हैं, पासपोर्ट सेवा केंद्र में मिलने का समय लेते हैं और पुलिस आपके पते की जाँच करती है।",
    },
    who: {
      en: "Any Indian citizen. Children apply with a parent or guardian.",
      hi: "कोई भी भारतीय नागरिक। बच्चे माता-पिता या अभिभावक के साथ आवेदन करते हैं।",
    },
    docs: [
      { en: "Proof of address", hi: "पते का प्रमाण" },
      { en: "Proof of date of birth", hi: "जन्म तिथि का प्रमाण" },
      { en: "Aadhaar or another ID proof", hi: "आधार या कोई अन्य पहचान पत्र" },
      { en: "Old passport, if you are renewing", hi: "पुराना पासपोर्ट, अगर नवीनीकरण कर रहे हैं" },
    ],
    steps: [
      { en: "Register on the Passport Seva website.", hi: "पासपोर्ट सेवा वेबसाइट पर रजिस्टर करें।" },
      { en: "Fill in the application form and submit it online.", hi: "आवेदन फ़ॉर्म भरें और ऑनलाइन जमा करें।" },
      { en: "Pay the fee and book an appointment at a Passport Seva Kendra.", hi: "फीस भरें और पासपोर्ट सेवा केंद्र में मिलने का समय बुक करें।" },
      { en: "Visit with your original documents for checks and a photo.", hi: "जाँच और फ़ोटो के लिए अपने मूल दस्तावेज़ लेकर जाएँ।" },
      { en: "Wait for police verification. Your passport is then sent by post.", hi: "पुलिस सत्यापन का इंतज़ार करें। फिर पासपोर्ट डाक से भेजा जाता है।" },
    ],
    mistakes: [
      { en: "Your name is spelled differently in different documents.", hi: "अलग-अलग दस्तावेज़ों में आपके नाम की वर्तनी अलग है।" },
      { en: "Going to the appointment without the original documents.", hi: "मूल दस्तावेज़ों के बिना अपॉइंटमेंट पर जाना।" },
    ],
    link: { label: "Passport Seva", url: "https://www.passportindia.gov.in" },
    keywords: ["passport", "पासपोर्ट"],
    prompt: { en: "How do I apply for a passport?", hi: "पासपोर्ट के लिए आवेदन कैसे करें?" },
  },
  {
    id: "voter",
    category: "identity",
    title: { en: "Voter ID", hi: "वोटर आईडी" },
    note: { en: "Register or correct details", hi: "पंजीकरण या सुधार" },
    summary: {
      en: "A voter ID shows that you are registered to vote. It is also accepted as an identity proof.",
      hi: "वोटर आईडी दिखाता है कि आप मतदाता के रूप में पंजीकृत हैं। यह पहचान के प्रमाण के रूप में भी माना जाता है।",
    },
    who: {
      en: "Indian citizens aged 18 or above.",
      hi: "18 वर्ष या उससे अधिक आयु के भारतीय नागरिक।",
    },
    docs: [
      { en: "A passport-size photo", hi: "पासपोर्ट साइज़ फ़ोटो" },
      { en: "Age proof, such as a birth or school certificate", hi: "आयु का प्रमाण, जैसे जन्म या स्कूल प्रमाण पत्र" },
      { en: "Address proof", hi: "पते का प्रमाण" },
    ],
    steps: [
      { en: "Open the Voters' Service Portal of the Election Commission and create an account with your phone number.", hi: "चुनाव आयोग का मतदाता सेवा पोर्टल खोलें और अपने फ़ोन नंबर से खाता बनाएँ।" },
      { en: "Choose the form for new registration.", hi: "नए पंजीकरण का फ़ॉर्म चुनें।" },
      { en: "Fill in your details and upload the documents.", hi: "अपनी जानकारी भरें और दस्तावेज़ अपलोड करें।" },
      { en: "Submit and note the reference number.", hi: "जमा करें और संदर्भ संख्या नोट करें।" },
      { en: "Track the status. An officer may visit to verify your address.", hi: "स्थिति देखते रहें। अधिकारी आपके पते की जाँच के लिए आ सकते हैं।" },
    ],
    mistakes: [
      { en: "Your name or age differs from your proof.", hi: "आपका नाम या उम्र प्रमाण से अलग है।" },
      { en: "Applying again when you are already registered.", hi: "पहले से पंजीकृत होने पर दोबारा आवेदन करना।" },
    ],
    link: { label: "Voters' Service Portal", url: "https://voters.eci.gov.in" },
    keywords: ["voter", "वोटर", "मतदाता", "election card"],
    prompt: { en: "How do I apply for a voter ID?", hi: "वोटर आईडी के लिए आवेदन कैसे करें?" },
  },
  {
    id: "licence",
    category: "travel",
    title: { en: "Driving licence", hi: "ड्राइविंग लाइसेंस" },
    note: { en: "Learner and permanent", hi: "लर्नर और स्थायी" },
    summary: {
      en: "A driving licence is the government permit to drive. You first get a learner's licence, then a permanent licence after a driving test.",
      hi: "ड्राइविंग लाइसेंस गाड़ी चलाने की सरकारी अनुमति है। पहले लर्नर लाइसेंस मिलता है, फिर ड्राइविंग टेस्ट के बाद स्थायी लाइसेंस।",
    },
    who: {
      en: "People who meet the age limit for their vehicle type. Rules can differ by vehicle and state.",
      hi: "वे लोग जो अपने वाहन के प्रकार की आयु सीमा पूरी करते हैं। नियम वाहन और राज्य के अनुसार अलग हो सकते हैं।",
    },
    docs: [
      { en: "Age proof", hi: "आयु का प्रमाण" },
      { en: "Address proof", hi: "पते का प्रमाण" },
      { en: "Passport-size photos", hi: "पासपोर्ट साइज़ फ़ोटो" },
      { en: "A medical certificate, where it is required", hi: "मेडिकल प्रमाण पत्र, जहाँ ज़रूरी हो" },
    ],
    steps: [
      { en: "Open the Parivahan Sarathi website and choose your state.", hi: "परिवहन सारथी वेबसाइट खोलें और अपना राज्य चुनें।" },
      { en: "Apply for a learner's licence and take the online test.", hi: "लर्नर लाइसेंस के लिए आवेदन करें और ऑनलाइन टेस्ट दें।" },
      { en: "After the waiting period, book a driving test slot.", hi: "प्रतीक्षा अवधि के बाद ड्राइविंग टेस्ट का समय बुक करें।" },
      { en: "Go to the RTO for the driving test with your documents.", hi: "अपने दस्तावेज़ लेकर ड्राइविंग टेस्ट के लिए RTO जाएँ।" },
      { en: "The permanent licence is sent to your address.", hi: "स्थायी लाइसेंस आपके पते पर भेजा जाता है।" },
    ],
    mistakes: [
      { en: "Booking the test before the waiting period ends.", hi: "प्रतीक्षा अवधि खत्म होने से पहले टेस्ट बुक करना।" },
      { en: "Photo or signature does not match the application.", hi: "फ़ोटो या हस्ताक्षर आवेदन से नहीं मिलते।" },
    ],
    link: { label: "Parivahan", url: "https://parivahan.gov.in/parivahan" },
    keywords: ["driving", "licence", "license", "dl", "ड्राइविंग", "लाइसेंस"],
    prompt: { en: "How do I get a driving licence?", hi: "ड्राइविंग लाइसेंस कैसे बनवाएँ?" },
  },
  {
    id: "ration",
    category: "certificate",
    title: { en: "Ration card", hi: "राशन कार्ड" },
    note: { en: "Food grain benefits", hi: "अनाज की सुविधा" },
    summary: {
      en: "A ration card is issued by your state government. It lets a family buy food grain at low prices and also works as an address proof.",
      hi: "राशन कार्ड आपकी राज्य सरकार देती है। इससे परिवार कम दाम पर अनाज खरीद सकता है और यह पते के प्रमाण के रूप में भी काम करता है।",
    },
    who: {
      en: "Families who meet the rules of their state. Rules differ by state.",
      hi: "वे परिवार जो अपने राज्य के नियम पूरे करते हैं। नियम हर राज्य में अलग होते हैं।",
    },
    docs: [
      { en: "Aadhaar of every family member", hi: "परिवार के हर सदस्य का आधार" },
      { en: "Proof of address", hi: "पते का प्रमाण" },
      { en: "Income details or an income certificate", hi: "आय का विवरण या आय प्रमाण पत्र" },
      { en: "A passport-size photo of the head of the family", hi: "परिवार के मुखिया की पासपोर्ट साइज़ फ़ोटो" },
    ],
    steps: [
      { en: "Open your state's food and civil supplies website.", hi: "अपने राज्य के खाद्य एवं नागरिक आपूर्ति विभाग की वेबसाइट खोलें।" },
      { en: "Choose to apply for a new ration card.", hi: "नए राशन कार्ड के लिए आवेदन चुनें।" },
      { en: "Fill in the details of every family member.", hi: "परिवार के हर सदस्य की जानकारी भरें।" },
      { en: "Upload the documents and submit.", hi: "दस्तावेज़ अपलोड करें और जमा करें।" },
      { en: "An officer may verify your home. The card is then issued.", hi: "अधिकारी आपके घर की जाँच कर सकते हैं। इसके बाद कार्ड जारी होता है।" },
    ],
    mistakes: [
      { en: "Leaving out a family member.", hi: "परिवार के किसी सदस्य को छोड़ देना।" },
      { en: "Spelling a name differently from Aadhaar.", hi: "नाम की वर्तनी आधार से अलग लिखना।" },
    ],
    link: { label: "National Food Security portal", url: "https://nfsa.gov.in" },
    keywords: ["ration", "राशन"],
    prompt: { en: "How do I apply for a ration card?", hi: "राशन कार्ड के लिए आवेदन कैसे करें?" },
  },
  {
    id: "income",
    category: "certificate",
    title: { en: "Income certificate", hi: "आय प्रमाण पत्र" },
    note: { en: "For scholarships and schemes", hi: "छात्रवृत्ति और योजनाओं के लिए" },
    summary: {
      en: "An income certificate is a paper from the state government that says how much your family earns in a year. It is used for scholarships, fee waivers and many schemes.",
      hi: "आय प्रमाण पत्र राज्य सरकार का वह कागज़ है जो बताता है कि आपके परिवार की सालाना आय कितनी है। यह छात्रवृत्ति, फीस माफ़ी और कई योजनाओं में काम आता है।",
    },
    who: {
      en: "Any resident of the state who needs proof of family income.",
      hi: "राज्य का कोई भी निवासी जिसे परिवार की आय का प्रमाण चाहिए।",
    },
    docs: [
      { en: "Aadhaar card", hi: "आधार कार्ड" },
      { en: "Proof of address", hi: "पते का प्रमाण" },
      { en: "Income proof, such as a salary slip, or a self-declaration for farmers and daily workers", hi: "आय का प्रमाण, जैसे सैलरी स्लिप, या किसानों और दिहाड़ी मज़दूरों के लिए स्व-घोषणा" },
      { en: "Ration card, if you have one", hi: "राशन कार्ड, अगर हो" },
    ],
    steps: [
      { en: "Open your state's e-District website.", hi: "अपने राज्य की ई-डिस्ट्रिक्ट वेबसाइट खोलें।" },
      { en: "Register or log in with your phone number.", hi: "अपने फ़ोन नंबर से रजिस्टर करें या लॉग इन करें।" },
      { en: "Choose the income certificate service and fill in the form.", hi: "आय प्रमाण पत्र सेवा चुनें और फ़ॉर्म भरें।" },
      { en: "Upload the documents and submit.", hi: "दस्तावेज़ अपलोड करें और जमा करें।" },
      { en: "Download the certificate once it is approved.", hi: "मंज़ूरी मिलने पर प्रमाण पत्र डाउनलोड करें।" },
    ],
    mistakes: [
      { en: "The income you write differs from your documents.", hi: "आपने जो आय लिखी वह दस्तावेज़ों से अलग है।" },
      { en: "Applying in a state where you do not live.", hi: "ऐसे राज्य में आवेदन करना जहाँ आप नहीं रहते।" },
    ],
    link: { label: "National Government Services Portal", url: "https://services.india.gov.in" },
    keywords: ["income certificate", "आय प्रमाण", "aay praman", "income proof"],
    prompt: { en: "How do I get an income certificate?", hi: "आय प्रमाण पत्र कैसे बनवाएँ?" },
  },
  {
    id: "kisan",
    category: "farm",
    title: { en: "PM-Kisan", hi: "पीएम-किसान" },
    note: { en: "Support for farmers", hi: "किसानों के लिए सहायता" },
    summary: {
      en: "PM-Kisan is a central scheme that sends money directly to the bank accounts of eligible small farming families, in instalments during the year.",
      hi: "पीएम-किसान केंद्र सरकार की योजना है जो पात्र छोटे किसान परिवारों के बैंक खाते में साल भर किस्तों में सीधे पैसे भेजती है।",
    },
    who: {
      en: "Farming families who meet the scheme rules. Some groups, such as income tax payers, are not eligible.",
      hi: "वे किसान परिवार जो योजना के नियम पूरे करते हैं। कुछ समूह, जैसे आयकर देने वाले, पात्र नहीं हैं।",
    },
    docs: [
      { en: "Aadhaar number", hi: "आधार नंबर" },
      { en: "A bank account linked to Aadhaar", hi: "आधार से जुड़ा बैंक खाता" },
      { en: "Land records", hi: "ज़मीन के रिकॉर्ड" },
      { en: "Mobile number", hi: "मोबाइल नंबर" },
    ],
    steps: [
      { en: "Open the PM-Kisan website and choose new farmer registration.", hi: "पीएम-किसान वेबसाइट खोलें और नया किसान पंजीकरण चुनें।" },
      { en: "Enter your Aadhaar number, state and the code shown.", hi: "अपना आधार नंबर, राज्य और दिखाया गया कोड डालें।" },
      { en: "Fill in your land and bank details.", hi: "अपनी ज़मीन और बैंक की जानकारी भरें।" },
      { en: "Submit, then complete e-KYC so that payments are not stopped.", hi: "जमा करें, फिर ई-केवाईसी पूरा करें ताकि भुगतान न रुके।" },
      { en: "Check your status on the same website.", hi: "उसी वेबसाइट पर अपनी स्थिति देखें।" },
    ],
    mistakes: [
      { en: "Skipping e-KYC.", hi: "ई-केवाईसी न करना।" },
      { en: "The bank account is not linked to Aadhaar.", hi: "बैंक खाता आधार से जुड़ा नहीं है।" },
    ],
    link: { label: "PM-Kisan", url: "https://pmkisan.gov.in" },
    keywords: ["kisan", "किसान", "pm-kisan", "pm kisan"],
    prompt: { en: "How do I register for PM-Kisan?", hi: "पीएम-किसान में पंजीकरण कैसे करें?" },
  },
  {
    id: "ayushman",
    category: "health",
    title: { en: "Ayushman Bharat", hi: "आयुष्मान भारत" },
    note: { en: "Health cover for families", hi: "परिवारों के लिए स्वास्थ्य बीमा" },
    summary: {
      en: "Ayushman Bharat PM-JAY is a health insurance scheme. It pays for hospital treatment for eligible families, up to a limit each year.",
      hi: "आयुष्मान भारत पीएम-जेएवाई स्वास्थ्य बीमा योजना है। यह पात्र परिवारों के अस्पताल के इलाज का खर्च हर साल एक सीमा तक उठाती है।",
    },
    who: {
      en: "Families included in the scheme's list. You can check on the official site.",
      hi: "वे परिवार जो योजना की सूची में शामिल हैं। आप आधिकारिक साइट पर जाँच सकते हैं।",
    },
    docs: [
      { en: "Aadhaar card", hi: "आधार कार्ड" },
      { en: "Ration card or another family proof", hi: "राशन कार्ड या परिवार का कोई अन्य प्रमाण" },
      { en: "Mobile number", hi: "मोबाइल नंबर" },
    ],
    steps: [
      { en: "Open the PM-JAY website and choose the option to check if you are eligible.", hi: "पीएम-जेएवाई वेबसाइट खोलें और पात्रता जाँचने का विकल्प चुनें।" },
      { en: "Enter your mobile number and the code, then search by name or ration card number.", hi: "अपना मोबाइल नंबर और कोड डालें, फिर नाम या राशन कार्ड नंबर से खोजें।" },
      { en: "If you are on the list, visit an Ayushman Mitra with your Aadhaar.", hi: "अगर आप सूची में हैं तो आधार लेकर आयुष्मान मित्र से मिलें।" },
      { en: "Get your Ayushman card made.", hi: "अपना आयुष्मान कार्ड बनवाएँ।" },
      { en: "Show the card at a listed hospital for cashless treatment.", hi: "कैशलेस इलाज के लिए सूचीबद्ध अस्पताल में कार्ड दिखाएँ।" },
    ],
    mistakes: [
      { en: "Not checking the eligibility list first.", hi: "पहले पात्रता सूची न देखना।" },
      { en: "Going to a hospital that is not on the scheme's list.", hi: "ऐसे अस्पताल जाना जो योजना की सूची में नहीं है।" },
    ],
    link: { label: "PM-JAY", url: "https://pmjay.gov.in" },
    keywords: ["ayushman", "आयुष्मान", "pmjay", "pm-jay", "health card", "health insurance"],
    prompt: { en: "How do I get an Ayushman Bharat card?", hi: "आयुष्मान भारत कार्ड कैसे बनवाएँ?" },
  },
  {
    id: "itr",
    category: "money",
    title: { en: "Income tax return", hi: "आयकर रिटर्न" },
    note: { en: "File your ITR", hi: "अपना आईटीआर भरें" },
    summary: {
      en: "An income tax return (ITR) is a yearly form that tells the Income Tax Department how much you earned and how much tax you paid.",
      hi: "आयकर रिटर्न (आईटीआर) सालाना फ़ॉर्म है जो आयकर विभाग को बताता है कि आपने कितना कमाया और कितना टैक्स भरा।",
    },
    who: {
      en: "People whose income is above the tax-free limit, and others who need to file for a refund, a loan or a visa.",
      hi: "वे लोग जिनकी आय टैक्स-मुक्त सीमा से ज़्यादा है, और वे भी जिन्हें रिफ़ंड, लोन या वीज़ा के लिए रिटर्न चाहिए।",
    },
    docs: [
      { en: "PAN card", hi: "पैन कार्ड" },
      { en: "Aadhaar", hi: "आधार" },
      { en: "Form 16 from your employer, or your income details", hi: "नियोक्ता से फ़ॉर्म 16, या आपकी आय का विवरण" },
      { en: "Bank account details and statements", hi: "बैंक खाते का विवरण और स्टेटमेंट" },
      { en: "Proofs of tax-saving investments, if you claim them", hi: "टैक्स बचाने वाले निवेश के प्रमाण, अगर आप दावा करते हैं" },
    ],
    steps: [
      { en: "Log in to the income tax e-filing portal with your PAN.", hi: "अपने पैन से आयकर ई-फाइलिंग पोर्टल पर लॉग इन करें।" },
      { en: "Choose the assessment year and the right ITR form.", hi: "निर्धारण वर्ष और सही आईटीआर फ़ॉर्म चुनें।" },
      { en: "Check the pre-filled details and fill in what is missing.", hi: "पहले से भरी जानकारी जाँचें और जो छूटा है उसे भरें।" },
      { en: "Submit the return and pay any tax that is due.", hi: "रिटर्न जमा करें और जो टैक्स बाकी हो उसे भरें।" },
      { en: "E-verify your return, for example with an Aadhaar code, so it counts as filed.", hi: "अपना रिटर्न ई-वेरिफ़ाई करें, जैसे आधार कोड से, तभी वह दाखिल माना जाता है।" },
    ],
    mistakes: [
      { en: "Not e-verifying after you submit.", hi: "जमा करने के बाद ई-वेरिफ़ाई न करना।" },
      { en: "Choosing the wrong ITR form.", hi: "गलत आईटीआर फ़ॉर्म चुनना।" },
    ],
    link: { label: "Income Tax e-filing portal", url: "https://www.incometax.gov.in" },
    keywords: ["itr", "tax return", "income tax", "आयकर", "रिटर्न", "आईटीआर"],
    prompt: { en: "How do I file my income tax return?", hi: "आयकर रिटर्न कैसे भरें?" },
  },
];

export const getService = (id: string) => services.find((s) => s.id === id);
