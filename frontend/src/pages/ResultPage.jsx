import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ResultTable from '../components/ResultTable';

const ResultPage = () => {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const resultRef = useRef(null);
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`/quiz/result/${id}`);
        
        if (response.data.success) {
          setResults(response.data.data);
        } else {
          setError('Sonuçlar yüklenirken bir hata oluştu');
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.message || 'Sonuçlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [id]);
  
  const handleExportPNG = async () => {
    if (resultRef.current) {
      try {
        setExporting(true);
        
        // Daha yüksek kaliteli görüntü için scale değeri artırıldı
        const canvas = await html2canvas(resultRef.current, {
          scale: 2,
          backgroundColor: null
        });
        
        canvas.toBlob((blob) => {
          saveAs(blob, `renk-testi-sonucu-${id}.png`);
          setExporting(false);
        });
      } catch (err) {
        console.error('Error exporting as PNG:', err);
        setExporting(false);
      }
    }
  };
  
  const handleExportXLSX = () => {
    if (results) {
      try {
        setExporting(true);
        
        const worksheet = XLSX.utils.json_to_sheet([
          {
            'Tarih': new Date(results.createdAt).toLocaleString(),
            'Kırmızı Puanı': results.redPoints,
            'Sarı Puanı': results.yellowPoints,
            'Yeşil Puanı': results.greenPoints,
            'Mavi Puanı': results.bluePoints,
            'Toplam Puan': results.redPoints + results.yellowPoints + results.greenPoints + results.bluePoints
          },
        ]);
        
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sonuçlar');
        XLSX.writeFile(workbook, `renk-testi-sonucu-${id}.xlsx`);
        
        setExporting(false);
      } catch (err) {
        console.error('Error exporting as XLSX:', err);
        setExporting(false);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-xl text-white">Sonuçlar yükleniyor...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-xl text-red-600 bg-white p-4 rounded-lg shadow-md">
          <p className="font-bold mb-2">Hata:</p>
          <p>{error}</p>
        </div>
        <Link 
          to="/" 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded inline-block hover:bg-blue-600"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }
  
  if (!results) {
    return (
      <div className="text-center py-10">
        <div className="text-xl text-white bg-gray-800 p-4 rounded-lg shadow-md">
          Sonuçlar bulunamadı
        </div>
        <Link 
          to="/" 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded inline-block hover:bg-blue-600"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Test Sonuçlarınız</h1>
      
      <div ref={resultRef}>
        <ResultTable results={results} />
      </div>
      
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={handleExportPNG}
          disabled={exporting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? 'İndiriliyor...' : 'PNG Olarak İndir'}
        </button>
        
        <button
          onClick={handleExportXLSX}
          disabled={exporting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? 'İndiriliyor...' : 'Excel Olarak İndir'}
        </button>
        
        <Link
          to="/quiz"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 inline-block"
        >
          Testi Tekrar Yap
        </Link>
        
        <Link
          to="/"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 inline-block"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
};

export default ResultPage;
