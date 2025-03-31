import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Renklerle İnsanları Tanıma Testi</h1>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-red-600 p-6 text-white rounded-lg">
          <h2 className="text-xl font-bold mb-2">Kırmızı</h2>
          <p>Liderlik, güç, kararlılık</p>
        </div>
        
        <div className="bg-yellow-500 p-6 text-white rounded-lg">
          <h2 className="text-xl font-bold mb-2">Sarı</h2>
          <p>Neşe, eğlence, sosyal iletişim</p>
        </div>
        
        <div className="bg-green-600 p-6 text-white rounded-lg">
          <h2 className="text-xl font-bold mb-2">Yeşil</h2>
          <p>Huzur, sakinlik, uyum</p>
        </div>
        
        <div className="bg-blue-600 p-6 text-white rounded-lg">
          <h2 className="text-xl font-bold mb-2">Mavi</h2>
          <p>Düzen, disiplin, mükemmeliyetçilik</p>
        </div>
      </div>
      
      <p className="mb-8 text-lg">
        Bu test, kişilik özelliklerinizi renklerle ilişkilendirerek hangi özelliklerin sizde daha baskın olduğunu gösterir. 15 soruyu yanıtlayarak kendinizi daha iyi tanıma fırsatı yakalayabilirsiniz.
      </p>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Test Nasıl Çalışır?</h2>
        <ul className="text-left list-disc pl-6 space-y-2">
          <li>15 adet soru cevaplayacaksınız.</li>
          <li>Her soruda en az 1, en fazla 2 şık seçebilirsiniz.</li>
          <li>İlk seçtiğiniz şık 2 puan, ikinci seçtiğiniz şık 1 puan değerindedir.</li>
          <li>Test sonunda baskın renk özelliklerinizi göreceksiniz.</li>
        </ul>
      </div>
      
      <Link
        to="/quiz"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 inline-block"
      >
        Testi Başlat
      </Link>
    </div>
  );
};

export default HomePage;
