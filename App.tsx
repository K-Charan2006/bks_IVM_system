import React, { useState, useEffect, useCallback } from 'react';
import { Screen, Language } from './types';
import TractorIcon from './components/icons/TractorIcon';

export const LANGUAGES: Record<string, { name: string; code: Language }> = {
  '1': { name: 'HINDI', code: 'hi' },
  '2': { name: 'ENGLISH', code: 'en' },
  '3': { name: 'PUNJABI', code: 'pa' },
  '4': { name: 'TAMIL', code: 'ta' },
  '5': { name: 'TELUGU', code: 'te' },
  '6': { name: 'KANNADA', code: 'kn' },
  '7': { name: 'MALAYALAM', code: 'ml' },
  '8': { name: 'BENGALI', code: 'bn' },
};

const PROMPTS: Record<Language, Record<Screen, string>> = {
  en: {
    [Screen.LAUNCH]: "Welcome to Bharat Kisan Sathiya!",
    [Screen.LANGUAGE]: "Please select your language.",
    [Screen.PHONE_ENTRY]: "Please enter your 10-digit phone number, then press the hash key to confirm.",
    [Screen.ROLE_SELECTION]: "Welcome! Please select your role. For Farmer, press 1. For Worker, press 2. For Machine Owner, press 3. Press 0 to go back.",
    [Screen.FARMER_MENU]: "Welcome, Farmer! Press 1 for My Crops. 2 for Crop Planner. 3 for Book Services. 4 for Market Prices. 5 for Quality Test. 0 for back.",
    [Screen.MY_CROPS]: "You are in My Crops. Registered crops are: Wheat, 12 of 24 hectares. Rice, 7 of 25 hectares. Press 0 to go back.",
    [Screen.WORKER_MENU]: "Welcome, Worker! Press 1 for Find Jobs. 2 for My Bids. 3 for Profile. 0 for back.",
    [Screen.MACHINE_OWNER_MENU]: "Welcome, Machine Owner! Press 1 for New Bookings. 2 for My Machines. 3 for Service Log. 0 for back.",
  },
  hi: {
    [Screen.LAUNCH]: "भारत किसान साथिया में आपका स्वागत है!",
    [Screen.LANGUAGE]: "कृपया अपनी भाषा चुनें।",
    [Screen.PHONE_ENTRY]: "कृपया अपना 10 अंकों का फोन नंबर दर्ज करें, फिर पुष्टि करने के लिए हैश कुंजी दबाएं।",
    [Screen.ROLE_SELECTION]: "आपका स्वागत है! कृपया अपनी भूमिका चुनें। किसान के लिए 1 दबाएं। मजदूर के लिए 2 दबाएं। मशीन मालिक के लिए 3 दबाएं। वापस जाने के लिए 0 दबाएं।",
    [Screen.FARMER_MENU]: "स्वागत है, किसान! मेरी फसलें के लिए 1 दबाएं। फसल योजनाकार के लिए 2। सेवाएं बुक करें के लिए 3। बाजार मूल्य के लिए 4। गुणवत्ता परीक्षण के लिए 5। वापस जाने के लिए 0।",
    [Screen.MY_CROPS]: "आप मेरी फसलें में हैं। पंजीकृत फसलें हैं: गेहूं, 24 में से 12 हेक्टेयर। चावल, 25 में سے 7 हेक्टेयर। वापस जाने के लिए 0 दबाएं।",
    [Screen.WORKER_MENU]: "स्वागत है, मजदूर! नौकरियाँ खोजें के लिए 1 दबाएं। मेरी बोलियाँ के लिए 2। प्रोफाइल के लिए 3। वापस जाने के लिए 0।",
    [Screen.MACHINE_OWNER_MENU]: "स्वागत है, मशीन मालिक! नई बुकिंग के लिए 1 दबाएं। मेरी मशीनें के लिए 2। सर्विस लॉग के लिए 3। वापस जाने के लिए 0।",
  },
  pa: {
    [Screen.LAUNCH]: "ਭਾਰਤ ਕਿਸਾਨ ਸਾਥੀਆ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ!",
    [Screen.LANGUAGE]: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ।",
    [Screen.PHONE_ENTRY]: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ 10-ਅੰਕਾਂ ਦਾ ਫ਼ੋਨ ਨੰਬਰ ਦਾਖਲ ਕਰੋ, ਫਿਰ ਪੁਸ਼ਟੀ ਕਰਨ ਲਈ ਹੈਸ਼ ਕੁੰਜੀ ਦਬਾਓ।",
    [Screen.ROLE_SELECTION]: "ਜੀ ਆਇਆਂ ਨੂੰ! ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ। ਕਿਸਾਨ ਲਈ 1 ਦਬਾਓ। ਵਰਕਰ ਲਈ 2 ਦਬਾਓ। ਮਸ਼ੀਨ ਮਾਲਕ ਲਈ 3 ਦਬਾਓ। ਪਿੱਛੇ ਜਾਣ ਲਈ 0 ਦਬਾਓ।",
    [Screen.FARMER_MENU]: "ਜੀ ਆਇਆਂ ਨੂੰ, ਕਿਸਾਨ! ਮੇਰੀਆਂ ਫਸਲਾਂ ਲਈ 1 ਦਬਾਓ। ਫਸਲ ਯੋਜਨਾਕਾਰ ਲਈ 2। ਸੇਵਾਵਾਂ ਬੁੱਕ ਕਰੋ ਲਈ 3। ਮਾਰਕੀਟ ਕੀਮਤਾਂ ਲਈ 4। ਗੁਣਵੱਤਾ ਟੈਸਟ ਲਈ 5। ਪਿੱਛੇ ਲਈ 0।",
    [Screen.MY_CROPS]: "ਤੁਸੀਂ ਮੇਰੀਆਂ ਫਸਲਾਂ ਵਿੱਚ ਹੋ। ਰਜਿਸਟਰਡ ਫਸਲਾਂ: ਕਣਕ, 24 ਵਿੱਚੋਂ 12 ਹੈਕਟੇਅਰ। ਚੌਲ, 25 ਵਿੱਚੋਂ 7 ਹੈਕਟੇਅਰ। ਪਿੱਛੇ ਜਾਣ ਲਈ 0 ਦਬਾਓ।",
    [Screen.WORKER_MENU]: "ਜੀ ਆਇਆਂ ਨੂੰ, ਵਰਕਰ! ਨੌਕਰੀਆਂ ਲੱਭੋ ਲਈ 1 ਦਬਾਓ। ਮੇਰੀਆਂ ਬੋਲੀਆਂ ਲਈ 2। ਪ੍ਰੋਫਾਈਲ ਲਈ 3। ਪਿੱਛੇ ਲਈ 0।",
    [Screen.MACHINE_OWNER_MENU]: "ਜੀ ਆਇਆਂ ਨੂੰ, ਮਸ਼ੀਨ ਮਾਲਕ! ਨਵੀਆਂ ਬੁਕਿੰਗਾਂ ਲਈ 1 ਦਬਾਓ। ਮੇਰੀਆਂ ਮਸ਼ੀਨਾਂ ਲਈ 2। ਸਰਵਿਸ ਲੌਗ ਲਈ 3। ਪਿੱਛੇ ਲਈ 0।",
  },
  ta: {
    [Screen.LAUNCH]: "பாரத் கிசான் சாத்தியாவிற்கு வரவேற்கிறோம்!",
    [Screen.LANGUAGE]: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்.",
    [Screen.PHONE_ENTRY]: "உங்கள் 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும், பின்னர் உறுதிப்படுத்த ஹேஷ் விசையை அழுத்தவும்.",
    [Screen.ROLE_SELECTION]: "வரவேற்கிறோம்! உங்கள் பங்கைத் தேர்ந்தெடுக்கவும். விவசாயிக்கு 1. தொழிலாளிக்கு 2. இயந்திர உரிமையாளருக்கு 3. பின் செல்ல 0.",
    [Screen.FARMER_MENU]: "வரவேற்கிறோம், விவசாயி! எனது பயிர்களுக்கு 1. பயிர் திட்டமிடுபவருக்கு 2. சேவைகளை முன்பதிவு செய்ய 3. சந்தை விலைகளுக்கு 4. தர சோதனைக்கு 5. பின் செல்ல 0.",
    [Screen.MY_CROPS]: "நீங்கள் எனது பயிர்களில் இருக்கிறீர்கள். பதிவு செய்யப்பட்ட பயிர்கள்: கோதுமை, 24 இல் 12 ஹெக்டேர். அரிசி, 25 இல் 7 ஹெக்டேர். பின் செல்ல 0.",
    [Screen.WORKER_MENU]: "வரவேற்கிறோம், தொழிலாளி! வேலைகளைக் கண்டுபிடிக்க 1. எனது ஏலங்கள் 2. சுயவிவரம் 3. பின் செல்ல 0.",
    [Screen.MACHINE_OWNER_MENU]: "வரவேற்கிறோம், இயந்திர உரிமையாளர்! புதிய முன்பதிவுகளுக்கு 1. எனது இயந்திரங்கள் 2. சேவை பதிவு 3. பின் செல்ல 0.",
  },
  te: {
    [Screen.LAUNCH]: "భారత్ కిసాన్ సతియాకు స్వాగతం!",
    [Screen.LANGUAGE]: "దయచేసి మీ భాషను ఎంచుకోండి.",
    [Screen.PHONE_ENTRY]: "దయచేసి మీ 10-అంకెల ఫోన్ నంబర్‌ను నమోదు చేయండి, ఆపై నిర్ధారించడానికి యాష్ కీని నొక్కండి.",
    [Screen.ROLE_SELECTION]: "స్వాగతం! దయచేసి మీ పాత్రను ఎంచుకోండి. రైతుకు 1. కార్మికుడికి 2. యంత్ర యజమానికి 3. వెనుకకు 0.",
    [Screen.FARMER_MENU]: "స్వాగతం, రైతు! నా పంటలకు 1. పంట ప్లానర్ కోసం 2. సేవలను బుక్ చేయండి 3. మార్కెట్ ధరలు 4. నాణ్యత పరీక్ష 5. వెనుకకు 0.",
    [Screen.MY_CROPS]: "మీరు నా పంటలలో ఉన్నారు. రిజిస్టర్డ్ పంటలు: గోధుమ, 24 లో 12 హెక్టార్లు. వరి, 25 లో 7 హెక్టార్లు. వెనుకకు వెళ్ళడానికి 0 నొక్కండి.",
    [Screen.WORKER_MENU]: "స్వాగతం, కార్మికుడా! ఉద్యోగాలను కనుగొనడానికి 1. నా బిడ్‌లు 2. ప్రొఫైల్ 3. వెనుకకు 0.",
    [Screen.MACHINE_OWNER_MENU]: "స్వాగతం, యంత్ర యజమాని! కొత్త బుకింగ్‌ల కోసం 1. నా యంత్రాలు 2. సర్వీస్ లాగ్ 3. వెనుకకు 0.",
  },
  kn: {
    [Screen.LAUNCH]: "ಭಾರತ್ ಕಿಸಾನ್ ಸಾಥಿಯಾಗೆ ಸ್ವಾಗತ!",
    [Screen.LANGUAGE]: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    [Screen.PHONE_ENTRY]: "ದಯವಿಟ್ಟು ನಿಮ್ಮ 10-ಅಂಕಿಯ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ, ನಂತರ ಖಚಿತಪಡಿಸಲು ಹ್ಯಾಶ್ ಕೀಲಿಯನ್ನು ಒತ್ತಿರಿ.",
    [Screen.ROLE_SELECTION]: "ಸ್ವಾಗತ! ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ. ರೈತರಿಗೆ 1. ಕೆಲಸಗಾರರಿಗೆ 2. ಯಂತ್ರ ಮಾಲೀಕರಿಗೆ 3. ಹಿಂದೆ ಹೋಗಲು 0.",
    [Screen.FARMER_MENU]: "ಸ್ವಾಗತ, ರೈತ! ನನ್ನ ಬೆಳೆಗಳಿಗೆ 1. ಬೆಳೆ ಯೋಜಕರಿಗೆ 2. ಸೇವೆಗಳನ್ನು ಬುಕ್ ಮಾಡಿ 3. ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು 4. ಗುಣಮಟ್ಟ ಪರೀಕ್ಷೆ 5. ಹಿಂದೆ ಹೋಗಲು 0.",
    [Screen.MY_CROPS]: "ನೀವು ನನ್ನ ಬೆಳೆಗಳಲ್ಲಿದ್ದೀರಿ. ನೋಂದಾಯಿತ ಬೆಳೆಗಳು: ಗೋಧಿ, 24 ರಲ್ಲಿ 12 ಹೆಕ್ಟೇರ್. ಅಕ್ಕಿ, 25 ರಲ್ಲಿ 7 ಹೆಕ್ಟೇರ್. ಹಿಂದೆ ಹೋಗಲು 0 ಒತ್ತಿರಿ.",
    [Screen.WORKER_MENU]: "ಸ್ವಾಗತ, ಕೆಲಸಗಾರ! ಉದ್ಯೋಗಗಳನ್ನು ಹುಡುಕಲು 1. ನನ್ನ ಬಿಡ್‌ಗಳು 2. ಪ್ರೊಫೈಲ್ 3. ಹಿಂದೆ ಹೋಗಲು 0.",
    [Screen.MACHINE_OWNER_MENU]: "ಸ್ವಾಗತ, ಯಂತ್ರ ಮಾಲೀಕ! ಹೊಸ ಬುಕಿಂಗ್‌ಗಳಿಗಾಗಿ 1. ನನ್ನ ಯಂತ್ರಗಳು 2. ಸೇವಾ ಲಾಗ್ 3. ಹಿಂದೆ ಹೋಗಲು 0.",
  },
  ml: {
    [Screen.LAUNCH]: "ഭാരത് കിസാൻ സതിയയിലേക്ക് സ്വാഗതം!",
    [Screen.LANGUAGE]: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക.",
    [Screen.PHONE_ENTRY]: "ദയവായി നിങ്ങളുടെ 10 അക്ക ഫോൺ നമ്പർ നൽകുക, തുടർന്ന് സ്ഥിരീകരിക്കുന്നതിന് ഹാഷ് കീ അമർത്തുക.",
    [Screen.ROLE_SELECTION]: "സ്വാഗതം! നിങ്ങളുടെ പങ്ക് തിരഞ്ഞെടുക്കുക. കർഷകനായി 1. തൊഴിലാളിക്കായി 2. മെഷീൻ ഉടമയ്ക്കായി 3. പിന്നോട്ട് പോകാൻ 0.",
    [Screen.FARMER_MENU]: "സ്വാഗതം, കർഷകാ! എൻ്റെ വിളകൾക്കായി 1. വിള പ്ലാനർ 2. സേവനങ്ങൾ ബുക്ക് ചെയ്യുക 3. വിപണി വിലകൾ 4. ഗുണനിലവാര പരിശോധന 5. പിന്നോട്ട് 0.",
    [Screen.MY_CROPS]: "നിങ്ങൾ എൻ്റെ വിളകളിലാണ്. രജിസ്റ്റർ ചെയ്ത വിളകൾ: ഗോതമ്പ്, 24-ൽ 12 ഹെക്ടർ. അരി, 25-ൽ 7 ഹെക്ടർ. തിരികെ പോകാൻ 0 അമർത്തുക.",
    [Screen.WORKER_MENU]: "സ്വാഗതം, തൊഴിലാളി! ജോലികൾ കണ്ടെത്താൻ 1. എൻ്റെ ബിഡുകൾ 2. പ്രൊഫൈൽ 3. പിന്നോട്ട് 0.",
    [Screen.MACHINE_OWNER_MENU]: "സ്വാഗതം, മെഷീൻ ഉടമ! പുതിയ ബുക്കിംഗുകൾക്കായി 1. എൻ്റെ മെഷീനുകൾ 2. സർവീസ് ലോഗ് 3. പിന്നോട്ട് 0.",
  },
  bn: {
    [Screen.LAUNCH]: "ভারত কিষাণ সাথিয়ায় আপনাকে স্বাগতম!",
    [Screen.LANGUAGE]: "আপনার ভাষা নির্বাচন করুন।",
    [Screen.PHONE_ENTRY]: "আপনার ১০-সংখ্যার ফোন নম্বর লিখুন, তারপর নিশ্চিত করতে হ্যাশ কী টিপুন।",
    [Screen.ROLE_SELECTION]: "স্বাগতম! আপনার ভূমিকা নির্বাচন করুন। কৃষকের জন্য ১. শ্রমিকের জন্য ২. মেশিন মালিকের জন্য ৩. ফিরে যেতে ০।",
    [Screen.FARMER_MENU]: "স্বাগতম, কৃষক! আমার ফসলের জন্য ১। ফসল পরিকল্পনাকারী ২। পরিষেবা বুক করুন ৩। বাজার দর ৪। গুণমান পরীক্ষা ৫। ফিরে যেতে ০।",
    [Screen.MY_CROPS]: "আপনি আমার ফসল বিভাগে আছেন। নিবন্ধিত ফসল: গম, ২৪ এর মধ্যে ১২ হেক্টর। চাল, ২৫ এর মধ্যে ৭ হেক্টর। ফিরে যেতে ০ চাপুন।",
    [Screen.WORKER_MENU]: "স্বাগতম, কর্মী! চাকরি খোঁজার জন্য ১। আমার দরপত্র ২। প্রোফাইল ৩। ফিরে যেতে ০।",
    [Screen.MACHINE_OWNER_MENU]: "স্বাগতম, মেশিন মালিক! নতুন বুকিংয়ের জন্য ১। আমার মেশিন ২। পরিষেবা লগ ৩। ফিরে যেতে ০।",
  }
};

const speak = (text: string, lang: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

interface ScreenContentProps {
  screen: Screen;
  phoneNumber: string;
  notification?: string;
}

const UssdNotification: React.FC<{ title: string; message: string; }> = ({ title, message }) => (
  <div className="absolute inset-x-3 top-4 bg-gray-200/95 text-black p-3 rounded-md shadow-lg border border-gray-400 z-10 animate-fade-in">
    <h3 className="font-bold text-base border-b border-gray-400 pb-1 mb-2">{title}</h3>
    <p className="text-sm leading-tight">{message}</p>
  </div>
);

const ScreenContent: React.FC<ScreenContentProps> = ({ screen, phoneNumber, notification }) => {
  const MenuItem: React.FC<{ num: number | string; text: string }> = ({ num, text }) => (
    <div className="flex justify-between">
      <span>{num}.</span>
      <span className="flex-1 text-right">{text}</span>
    </div>
  );

  switch (screen) {
    case Screen.LAUNCH:
      return (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
          <TractorIcon className="w-24 h-24 text-green-300 mb-4" />
          <h1 className="text-3xl font-bold tracking-wider text-green-300">BHARAT KISAN SATHIYA</h1>
        </div>
      );
    case Screen.LANGUAGE:
      return (
        <div className="p-4 animate-fade-in">
          <h2 className="text-center text-xl mb-6 font-bold">SELECT LANGUAGE</h2>
          <div className="space-y-2 text-lg">
            {Object.entries(LANGUAGES).map(([key, { name }]) => (
              <MenuItem key={key} num={key} text={name} />
            ))}
          </div>
        </div>
      );
    case Screen.PHONE_ENTRY:
      return (
        <div className="p-4 flex flex-col justify-center h-full text-center animate-fade-in">
          <h2 className="text-xl mb-4 font-bold">ENTER PHONE NUMBER</h2>
          <div className="bg-black/30 p-4 rounded-lg h-12 flex items-center justify-center mb-4">
            <p className="text-2xl tracking-[0.2em]">{phoneNumber.padEnd(10, '_')}</p>
          </div>
          <p className="text-sm text-green-400">PRESS # TO CONFIRM</p>
          <p className="text-sm text-green-400 mt-1">PRESS * TO DELETE</p>
        </div>
      );
    case Screen.ROLE_SELECTION:
       return (
        <div className="p-4 animate-fade-in">
          <h2 className="text-center text-xl mb-6 font-bold">WELCOME, SELECT ROLE:</h2>
          <div className="space-y-2 text-lg">
            <MenuItem num={1} text="FARMER" />
            <MenuItem num={2} text="WORKER" />
            <MenuItem num={3} text="MACHINE OWNER" />
            <MenuItem num={0} text="BACK" />
          </div>
        </div>
      );
    case Screen.FARMER_MENU:
       return (
        <div className="p-4 animate-fade-in relative h-full">
           {notification && <UssdNotification 
            title="Notification"
            message={notification}
          />}
          <div className="pt-24">
            <h2 className="text-center text-xl mb-6 font-bold">FARMER MENU</h2>
            <div className="space-y-2 text-lg">
              <MenuItem num={1} text="MY CROPS" />
              <MenuItem num={2} text="CROP PLANNER" />
              <MenuItem num={3} text="BOOK SERVICES" />
              <MenuItem num={4} text="MARKET PRICES" />
              <MenuItem num={5} text="QUALITY TEST" />
              <MenuItem num={0} text="BACK" />
            </div>
          </div>
        </div>
      );
    case Screen.MY_CROPS:
       return (
        <div className="p-4 animate-fade-in">
          <h2 className="text-center text-xl mb-6 font-bold">MY CROPS</h2>
          <div className="space-y-2 text-lg">
            <MenuItem num={1} text="WHEAT (12/24 HA)" />
            <MenuItem num={2} text="RICE (07/25 HA)" />
            <MenuItem num={3} text="COTTON (05/23 HA)" />
            <MenuItem num={0} text="BACK" />
          </div>
        </div>
      );
    case Screen.WORKER_MENU:
       return (
        <div className="p-4 animate-fade-in relative h-full">
           {notification && <UssdNotification 
            title="Job Alert"
            message={notification}
          />}
          <div className="pt-24">
            <h2 className="text-center text-xl mb-6 font-bold">WORKER MENU</h2>
            <div className="space-y-2 text-lg">
              <MenuItem num={1} text="FIND JOBS" />
              <MenuItem num={2} text="MY BIDS" />
              <MenuItem num={3} text="PROFILE" />
              <MenuItem num={0} text="BACK" />
            </div>
          </div>
        </div>
      );
    case Screen.MACHINE_OWNER_MENU:
       return (
        <div className="p-4 animate-fade-in relative h-full">
           {notification && <UssdNotification 
            title="Booking Request"
            message={notification}
          />}
          <div className="pt-24">
            <h2 className="text-center text-xl mb-6 font-bold">MACHINE OWNER MENU</h2>
            <div className="space-y-2 text-lg">
              <MenuItem num={1} text="NEW BOOKINGS" />
              <MenuItem num={2} text="MY MACHINES" />
              <MenuItem num={3} text="SERVICE LOG" />
              <MenuItem num={0} text="BACK" />
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

interface KeypadProps {
  onKeyPress: (key: string) => void;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => onKeyPress(key)}
          className="text-3xl font-bold bg-gray-600/50 hover:bg-gray-500/50 transition-colors duration-150 rounded-full aspect-square flex items-center justify-center text-green-200"
        >
          {key}
        </button>
      ))}
    </div>
  );
};

const names = ['Ram Singh', 'Sita Devi', 'Anil Kumar', 'Priya Sharma', 'Vijay Patel'];
const crops = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize'];

export default function App() {
  const [screen, setScreen] = useState<Screen>(Screen.LAUNCH);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [language, setLanguage] = useState<Language>('en');
  const [notification, setNotification] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const generateFarmerNotification = useCallback(() => {
    const amount = Math.floor(Math.random() * 4001) + 1000;
    setNotification(`Subsidy of ${amount} INR has been credited to your account.`);
  }, []);
  
  const generateWorkerNotification = useCallback(() => {
    const crop = crops[Math.floor(Math.random() * crops.length)];
    const area = Math.floor(Math.random() * 8) + 2;
    setNotification(`New job available: ${crop} harvesting for ${area} Hectares.`);
  }, []);

  const generateMachineOwnerNotification = useCallback(() => {
    const name = names[Math.floor(Math.random() * names.length)];
    const hours = Math.floor(Math.random() * 4) + 1;
    setNotification(`New booking request from ${name} for a Tractor (${hours} hours).`);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    if (screen === Screen.LAUNCH) {
        const timer = setTimeout(() => setScreen(Screen.LANGUAGE), 3000);
        speak(PROMPTS[language][screen], language);
        return () => clearTimeout(timer);
    }
    
    let notificationText = '';
    if (screen === Screen.FARMER_MENU) {
      generateFarmerNotification();
      notificationText = notification + '. ';
    } else if (screen === Screen.WORKER_MENU) {
      generateWorkerNotification();
      notificationText = notification + '. ';
    } else if (screen === Screen.MACHINE_OWNER_MENU) {
      generateMachineOwnerNotification();
      notificationText = notification + '. ';
    } else {
      setNotification('');
    }
    
    speak(notificationText + PROMPTS[language][screen], language);
    
    return () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, isInitialized, language]);

  const handleKeyPress = useCallback((key: string) => {
    switch (screen) {
      case Screen.LANGUAGE:
        if (LANGUAGES[key]) {
          setLanguage(LANGUAGES[key].code);
          setScreen(Screen.PHONE_ENTRY);
        }
        break;
      case Screen.PHONE_ENTRY:
        if (/\d/.test(key) && phoneNumber.length < 10) {
          setPhoneNumber(prev => prev + key);
        } else if (key === '*' && phoneNumber.length > 0) {
          setPhoneNumber(prev => prev.slice(0, -1));
        } else if (key === '#' && phoneNumber.length === 10) {
          setScreen(Screen.ROLE_SELECTION);
        }
        break;
      case Screen.ROLE_SELECTION:
        if (key === '1') setScreen(Screen.FARMER_MENU);
        else if (key === '2') setScreen(Screen.WORKER_MENU);
        else if (key === '3') setScreen(Screen.MACHINE_OWNER_MENU);
        else if (key === '0') {
          setPhoneNumber('');
          setScreen(Screen.PHONE_ENTRY);
        }
        break;
      case Screen.FARMER_MENU:
        if (key === '1') setScreen(Screen.MY_CROPS);
        else if (key === '0') setScreen(Screen.ROLE_SELECTION);
        break;
      case Screen.MY_CROPS:
        if (key === '0') setScreen(Screen.FARMER_MENU);
        break;
      case Screen.WORKER_MENU:
      case Screen.MACHINE_OWNER_MENU:
        if (key === '0') setScreen(Screen.ROLE_SELECTION);
        break;
    }
  }, [screen, phoneNumber]);

  const initializeApp = () => {
    const initialUtterance = new SpeechSynthesisUtterance(' ');
    initialUtterance.volume = 0;
    window.speechSynthesis.speak(initialUtterance);
    setIsInitialized(true);
  };

  if (!isInitialized) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
            <div className="text-center">
                <h1 className="text-white text-3xl mb-4">Bharat Kisan Sathiya</h1>
                <button 
                    onClick={initializeApp}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-all"
                >
                    Start Application
                </button>
                <p className="text-gray-400 mt-4">Click to enable audio prompts.</p>
            </div>
        </div>
    );
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-800 to-black">
      <div className="w-full max-w-sm mx-auto bg-gray-800 border-8 border-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/400/800?image=1043&blur=2)' }}>
          <div className="w-full h-full bg-black/70 backdrop-blur-sm flex flex-col justify-between">
            {/* Screen Area */}
            <div className="flex-1 text-green-300 font-medium text-xl p-4 min-h-[300px]">
              <ScreenContent screen={screen} phoneNumber={phoneNumber} notification={notification} />
            </div>

            {/* Keypad Area */}
            <div className="bg-black/20">
              <Keypad onKeyPress={handleKeyPress} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
