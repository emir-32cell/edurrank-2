const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
    // Arayüzden gelen body'yi konsola yazdırıyoruz ki dil gelmiş mi görelim
    console.log("\n📦 Arayüzden Gelen Veri:", req.body); 

    const uniName = req.body.universityName || "Bilinmeyen Üniversite";
    const lang = req.body.language || "tr"; 
    
    console.log(`🚀 ANALİZ BAŞLADI: Hedef Üniversite -> ${uniName} | Dil: ${lang.toUpperCase()}`);

    let caldwellScore = Math.floor(Math.random() * (90 - 60 + 1)) + 60; 
    let ipedsScore = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
    let knowledgeEScore = Math.floor(Math.random() * (90 - 60 + 1)) + 60;

    // =====================================================================
    // 🇹🇷 TÜRKÇE VERİ SETİ (Senin Orijinal Kodun)
    // =====================================================================
    const akademikTR = [
        {
            baslik: "1. Academic Personnel Capacity",
            olumlu_olumsuz: "Kadro niceliği olumlu, uluslararası çeşitlilik olumsuz.",
            yeterlilik: "Sayısal olarak yeterli ancak niteliksel dağılımda gelişime açık.",
            neden_yeterli_yetersiz: "Öğrenci başına düşen hoca sayısı ideal düzeyde. Ancak yabancı akademisyen oranı %5'in altında.",
            yapilmali: "Yurtdışı doktoralı akademisyenler için cazip istihdam paketleri oluşturulmalı.",
            yapilmamali: "Sadece kurumun kendi mezunlarını kadroya alma (inbreeding) hatasına düşülmemeli."
        },
        {
            baslik: "2. Research and Innovation (R&D)",
            olumlu_olumsuz: "Makale sayısı olumlu, patent başvuruları ve sanayi entegrasyonu olumsuz.",
            yeterlilik: "Teorik üretimde yeterli, inovasyonun ticarileşmesinde yetersiz.",
            neden_yeterli_yetersiz: "Bilimsel yayın sayısı küresel ortalamanın üstünde. Çıkan yayınların sanayiye dönüşüm oranı çok düşük.",
            yapilmali: "Teknokent ve kuluçka merkezleri global sanayi devleriyle entegre çalışmalı.",
            yapilmamali: "Sadece sayıyı artırmaya yönelik etki değeri düşük yayınlara zorlanmamalı."
        },
        {
            baslik: "3. International Mobility",
            olumlu_olumsuz: "Giden öğrenci sayısı olumlu, tam zamanlı uluslararası öğrenci oranı olumsuz.",
            yeterlilik: "Değişim programlarında yeterli, kalıcı yabancı beyin göçünde yetersiz.",
            neden_yeterli_yetersiz: "Erasmus/Exchange anlaşmaları çok çeşitli. Ancak lisans/yüksek lisans yapan tam zamanlı yabancı öğrenci az.",
            yapilmali: "İngilizce lisans programlarının sayısı artırılmalı ve global fuarlarda tanıtılmalı.",
            yapilmamali: "Bölgesel krizlerden kaçan öğrencilere odaklanıp global kalite standartları düşürülmemeli."
        },
        {
            baslik: "4. Physical Infrastructure",
            olumlu_olumsuz: "Derslik kapasiteleri olumlu, ileri düzey araştırma laboratuvarları olumsuz.",
            yeterlilik: "Temel eğitimde yeterli, spesifik araştırmalarda yetersiz.",
            neden_yeterli_yetersiz: "Amfi ve çalışma salonları modern. Yapay zeka ve biyoteknoloji gibi niş alanlarda cihaz eksiği var.",
            yapilmali: "Özel sektör sponsorluklarıyla tematik laboratuvarlar kurulmalı.",
            yapilmamali: "Kullanılmayacak gösterişli binalar yapmak yerine iç donanıma bütçe ayrılmalı."
        },
        {
            baslik: "5. Digital Footprint (GUV)",
            olumlu_olumsuz: "Web sitesi trafiği olumlu, uluslararası haberlerde yer alma olumsuz.",
            yeterlilik: "Yerel dijital pazarlamada yeterli, global marka bilinirliğinde yetersiz.",
            neden_yeterli_yetersiz: "Ulusal aramalarda organik trafik yüksek. Ancak Amerikan ve Avrupa medyasında kurumun adı geçmiyor.",
            yapilmali: "Araştırma başarıları çok dilli basın bültenleriyle global PR ajanslarına servis edilmeli.",
            yapilmamali: "Sadece sosyal medyada takipçi satın alma gibi organik olmayan büyüme yöntemleri kullanılmamali."
        },
        {
            baslik: "6. Graduate Employability",
            olumlu_olumsuz: "İlk 6 ayda iş bulma oranı olumlu, global şirketlerde yöneticilik oranı olumsuz.",
            yeterlilik: "Sektöre giriş için yeterli, üst düzey kariyere hazırlıkta gelişime açık.",
            neden_yeterli_yetersiz: "Yerel şirketlerde mezun kabul oranı yüksek. Fortune 500 şirketlerindeki mezun ağı zayıf.",
            yapilmali: "Uluslararası staj programları ve global mentörlük ağları (Alumni) aktif edilmeli.",
            yapilmamali: "Sektörden kopuk, sadece teorik ağırlıklı müfredatlarla eğitim verilmemeli."
        },
        {
            baslik: "7. Financial Endowment (IPEDS)",
            olumlu_olumsuz: "Devlet/Vakıf fonları olumlu, öz gelir yaratma kapasitesi olumsuz.",
            yeterlilik: "Günlük operasyonlar için yeterli, kriz anı büyüme projeksiyonu için yetersiz.",
            neden_yeterli_yetersiz: "Yıllık bütçe hedefleri tutturuluyor. Mezun bağışları ve patent gelirleri yok denecek kadar az.",
            yapilmali: "Mezunlardan ve sanayiden düzenli bağış toplayacak kurumsal bir fon (Endowment) kurulmalı.",
            yapilmamali: "Gelir artırmak için sadece öğrenci harçlarına sürekli zam yapılmamalı."
        },
        {
            baslik: "8. Open Access (Knowledge E)",
            olumlu_olumsuz: "Veritabanı üyelikleri olumlu, kurum içi açık erişim arşivi olumsuz.",
            yeterlilik: "Literatür taraması için yeterli, bilimi dünyayla paylaşmada yetersiz.",
            neden_yeterli_yetersiz: "Öğrencilerin global makalelere erişimi tam. Üniversitenin kendi ürettiği tez ve makaleler dışarıya kapalı.",
            yapilmali: "Kurumsal bir DSpace/Açık Arşiv sistemi kurulup tüm akademisyenler buraya entegre edilmeli.",
            yapilmamali: "Akademik üretimler sadece kapalı ve ücretli dergilere hapsedilmemeli."
        },
        {
            baslik: "9. Educational Technology",
            olumlu_olumsuz: "LMS altyapısı olumlu, interaktif dijital içerik üretimi olumsuz.",
            yeterlilik: "Ders materyali paylaşımında yeterli, asenkron etkileşimli eğitimde yetersiz.",
            neden_yeterli_yetersiz: "Sunucular çökmeden binlerce öğrenciyi kaldırabiliyor. Sadece PDF yükleniyor, video/simülasyon yok.",
            yapilmali: "AR/VR destekli sanal laboratuvarlar ve profesyonel stüdyo çekimleri sisteme eklenmeli.",
            yapilmamali: "Uzaktan eğitim, örgün eğitimin ucuz bir kopyası gibi tasarlanmamalı."
        },
        {
            baslik: "10. Incubation and Startups",
            olumlu_olumsuz: "Girişimcilik dersleri olumlu, tohum yatırımı alan start-up çıkışı olumsuz.",
            yeterlilik: "Teorik teşvikte yeterli, şirketleşme (Spin-off) aşamasında yetersiz.",
            neden_yeterli_yetersiz: "Öğrencilerin iş planı hazırlama becerileri yüksek. Melek yatırımcı ağı kurulamadığı için fikirler ölüyor.",
            yapilmali: "Kampüs içinde bir 'Girişimcilik Fonu' kurularak ilk can suyu sermayesi (Seed Fund) verilmeli.",
            yapilmamali: "Girişimcilik sadece not alınan bir seçmeli ders olarak bırakılmamalı."
        },
        {
            baslik: "11. Student Support Services",
            olumlu_olumsuz: "Kampüs içi güvenlik olumlu, psikolojik ve akademik danışmanlık olumsuz.",
            yeterlilik: "Fiziksel barınmada yeterli, mental sağlık ve rehberlikte yetersiz.",
            neden_yeterli_yetersiz: "Yurtlar modern ve güvenli. Binlerce öğrenciye sadece 1-2 psikolog düşüyor.",
            yapilmali: "Öğrenci destek ve kariyer planlama ofislerindeki uzman personel sayısı acilen artırılmalı.",
            yapilmamali: "Öğrencilerin idari süreçlerle ilgili şikayetleri bürokratik engellere takılmamalı."
        },
        {
            baslik: "12. Eco-Campus & Sustainability",
            olumlu_olumsuz: "Geri dönüşüm kutuları olumlu, enerji verimliliği ve yenilenebilir enerji olumsuz.",
            yeterlilik: "Temel farkındalıkta yeterli, karbon ayak izi sıfırlama hedefinde yetersiz.",
            neden_yeterli_yetersiz: "Kampüs içi atık ayrıştırma kültürü oturmuş. Binaların enerji tüketimi yüksek, güneş paneli yok.",
            yapilmali: "Çatılara güneş panelleri kurulmalı ve akıllı bina teknolojilerine geçilmeli.",
            yapilmamali: "Sadece ağaç dikip 'Yeşil Kampüs' rozeti almakla yetinilmemeli."
        },
        {
            baslik: "13. Inclusivity and Accessibility",
            olumlu_olumsuz: "Cinsiyet eşitliği rasyosu olumlu, dezavantajlı ve engelli erişimi olumsuz.",
            yeterlilik: "Burslu/burssuz dengesinde yeterli, fiziksel erişilebilirlikte yetersiz.",
            neden_yeterli_yetersiz: "Kadın/erkek öğrenci ve akademisyen dağılımı dengeli. Görme ve bedensel engelliler için kampüs tasarımı eksik.",
            yapilmali: "Tüm binalar, web siteleri ve ders materyalleri evrensel tasarım kurallarına uygun hale getirilmeli.",
            yapilmamali: "Kapsayıcılık politikaları sadece kağıt üzerinde bir PR aracı olarak kalmamalı."
        },
        {
            baslik: "14. Industrial Partnerships",
            olumlu_olumsuz: "Sosyal sorumluluk projeleri olumlu, sanayi odaklı bitirme projeleri olumsuz.",
            yeterlilik: "Sivil toplum katkısında yeterli, reel sektör problem çözümünde yetersiz.",
            neden_yeterli_yetersiz: "Topluma hizmet uygulamaları çok aktif. Mühendislik ve işletme tezleri şirketlerin gerçek dertlerini çözmüyor.",
            yapilmali: "TÜBİTAK/Avrupa Birliği destekli sanayi ortaklı (Co-op) eğitim modellerine geçilmeli.",
            yapilmamali: "Üniversite, bulunduğu şehrin sanayisinden izole bir 'fildişi kule' olmamalı."
        },
        {
            baslik: "15. Corporate Identity & Branding",
            olumlu_olumsuz: "Sosyal medya etkileşimi olumlu, akademik kriz yönetimi olumsuz.",
            yeterlilik: "Öğrenci adaylarına ulaşmada yeterli, bilimsel prestij inşasında yetersiz.",
            neden_yeterli_yetersiz: "Instagram kullanımı çok canlı. Kurumla ilgili negatif akademik eleştirilere profesyonel yanıt verilemiyor.",
            yapilmali: "Bilim iletişimi üzerine uzmanlaşmış bir PR masası kurularak araştırmalar markalaştırılmalı.",
            yapilmamali: "Kurumsal hesaplardan sadece rektörün ziyaretleri ve etkinlik afişleri paylaşılmamalı."
        },
        {
            baslik: "16. Student Societies & Social Life",
            olumlu_olumsuz: "Kulüp çeşitliliği olumlu, kulüplere ayrılan bütçe ve imkanlar olumsuz.",
            yeterlilik: "Sosyalleşme alanında yeterli, profesyonel etkinlik organizasyonunda yetersiz.",
            neden_yeterli_yetersiz: "Çok sayıda aktif kulüp var. Ancak kulüplerin büyük çaplı zirveler yapacak bütçesi yok.",
            yapilmali: "Kulüplere kurumsal sponsorluk bulmaları için yasal ve lojistik destek sağlanmalı.",
            yapilmamali: "İdari yönetim, öğrenci etkinliklerini aşırı denetleyerek inisiyatif almalarını engellememeli."
        },
        {
            baslik: "17. Language Preparatory Quality",
            olumlu_olumsuz: "Dilbilgisi ve okuma eğitimi olumlu, pratik ve konuşma pratiği olumsuz.",
            yeterlilik: "Sınav geçmek için yeterli, akıcı iletişim ve akademik tartışma için yetersiz.",
            neden_yeterli_yetersiz: "Öğrenciler ulusal dil sınavlarında başarılı oluyor. Bölüme geçince İngilizce sunum yapmakta zorlanıyorlar.",
            yapilmali: "Ana dili İngilizce olan okutman sayısı artırılmalı ve konuşma kulüpleri zorunlu olmalı.",
            yapilmamali: "Hazırlık sınıfı sadece test çözülen bir lise 5. sınıf mantığıyla yürütülmemeli."
        },
        {
            baslik: "18. Technology Transfer (TTO)",
            olumlu_olumsuz: "Patent başvuru süreçleri olumlu, patent ticarileştirme ve lisanslama olumsuz.",
            yeterlilik: "Bürokratik destekte yeterli, fikri mülkiyet satışında yetersiz.",
            neden_yeterli_yetersiz: "Akademisyenlerin buluşlarını patentlemesi hızlıca sağlanıyor. Alınan patentler sanayiye satılamayıp rafta bekliyor.",
            yapilmali: "TTO içinde özel sektör deneyimi olan 'Teknoloji Brokerları' istihdam edilmeli.",
            yapilmamali: "TTO, akademisyenin işini zorlaştıran bir evrak onay merkezi haline dönüşmemeli."
        },
        {
            baslik: "19. Cultural and Arts Footprint",
            olumlu_olumsuz: "Kampüs içi sergiler olumlu, uluslararası festivallere ev sahipliği olumsuz.",
            yeterlilik: "Yerel sanat teşvikinde yeterli, global kültür entegrasyonunda yetersiz.",
            neden_yeterli_yetersiz: "Güzel sanatlar fakültesinin iç etkinlikleri düzenli. Şehre değer katan büyük çaplı konser/festivaller yapılmıyor.",
            yapilmali: "Üniversite, şehrin kültürel çekim merkezi olacak büyük bir kongre ve sanat merkezine sahip olmalı.",
            yapilmamali: "Sanatsal faaliyetlere ayrılan bütçe, kriz dönemlerinde ilk kesilen ödenek olmamalı."
        },
        {
            baslik: "20. Executive Agile Leadership",
            olumlu_olumsuz: "İdari istikrar olumlu, aşağıdan yukarıya çevik karar alma olumsuz.",
            yeterlilik: "Sistemi ayakta tutmakta yeterli, yenilikçi riskler almakta yetersiz.",
            neden_yeterli_yetersiz: "Kurumun mali ve idari işleyişi saat gibi çalışıyor. Genç akademisyenlerin karar mekanizmalarına katılımı yok.",
            yapilmali: "Yönetim kurullarına genç araştırmacı ve öğrenci temsilcileri aktif oy hakkıyla dahil edilmeli.",
            yapilmamali: "Üniversite, hiyerarşik ve bürokratik bir devlet dairesi mantığıyla yönetilmemeli."
        }
    ];

    const sosyalTR = [
        {
            baslik: "💼 LinkedIn Kurumsal Ağ Yönetimi",
            olumlu_olumsuz: "Mezun ve akademisyen profilleri güçlü, kurumsal şirket ortaklık paylaşımları olumsuz.",
            yeterlilik: "Profesyonel imaj için yeterli, endüstriyel fon ve sponsorluk çekmede gelişime açık.",
            neden_yeterli_yetersiz: "Okulun mezun ağı geniş ve üst düzey şirketlerde. Ancak teknokent projelerinin global devlere pazarlanması eksik.",
            yapilmali: "Akademisyenlerin patentli projeleri ve üniversite-sanayi başarıları makale formatında öne çıkarılmalı.",
            yapilmamali: "Sadece mezuniyet töreni fotoğrafları paylaşarak profesyonel network platformu sıradanlaştırılmamalı."
        },
        {
            baslik: "📸 Instagram Görsel Marka İletişimi",
            olumlu_olumsuz: "Kampüs yaşamı ve görsel estetik paylaşımlar olumlu, akademik başarı duyuruları olumsuz.",
            yeterlilik: "Yerel aday öğrencilere ulaşmada yeterli, uluslararası elit öğrenci algısında yetersiz.",
            neden_yeterli_yetersiz: "Etkinlik ve kampüs görselleri yüksek etkileşim alıyor. Fakat küresel bilimsel başarılar çok sönük aktarılıyor.",
            yapilmali: "Laboratuvardaki buluşlar ve bilimsel süreçler, popüler dilde 'Reels' videoları haline getirilmeli.",
            yapilmamali: "Kurumsal hesabı sadece bir öğrenci kulübü sayfasıymış gibi çok ciddiyetsiz yönetmemeli."
        },
        {
            baslik: "🐦 X (Twitter) Akademik ve Anlık Etkileşim",
            olumlu_olumsuz: "Bilimsel duyuru ve makale linklemeleri olumlu, kriz anı etkileşim yönetimi olumsuz.",
            yeterlilik: "Akademik camia içi iletişimde yeterli, kamuoyu gündemi oluşturmada yetersiz.",
            neden_yeterli_yetersiz: "Akademisyenlerin yayınları etiketlenerek paylaşılıyor. Okulla ilgili bir iddia çıktığında hızlı cevap verilemiyor.",
            yapilmali: "Küresel trend konulara (Trending Topics) üniversitenin uzman hocalarının görüşleriyle anlık tweet serileri atılmalı.",
            yapilmamali: "Kullanıcı yorumlarını tamamen kapatarak şeffaf olmayan, korkak bir kurum imajı çizilmemeli."
        },
        {
            baslik: "▶️ YouTube Video Tabanlı Eğitim ve Tanıtım",
            olumlu_olumsuz: "Kampüs tanıtım filmleri olumlu, açık ders (MOOC) ve sürekli güncel içerik üretimi olumsuz.",
            yeterlilik: "Yıllık tekil reklam dönemlerinde yeterli, sürdürülebilir dijital kütüphane vizyonunda yetersiz.",
            neden_yeterli_yetersiz: "Tercih dönemi videoları profesyonelce çekilmiş. Yıl içinde kanal tamamen atıl bırakılıyor, video yüklenmiyor.",
            yapilmali: "MIT ve Stanford gibi dünya devlerinin yaptığı gibi popüler dersler canlı yayınlanmalı ve oynatma listeleri kurulmalı.",
            yapilmamali: "Kanalı sadece rektörün konuşma videolarının yüklendiği sıkıcı bir arşiv deposu yapmamalı."
        },
        {
            baslik: "🎵 TikTok Genç Kitle ve Aday Öğrenci İletişimi",
            olumlu_olumsuz: "Öğrenci odaklı eğlenceli içerikler olumlu, kurumsal prestij dengesi olumsuz.",
            yeterlilik: "Z kuşağına samimi görünmede yeterli, güvenilirlik algısı inşasında yetersiz.",
            neden_yeterli_yetersiz: "Kampüsteki öğrencilerin mizahi içerikleri yüksek izlenme alıyor. Ancak akademik ağırlık sıfıra inmiş durumda.",
            yapilmali: "Üniversitedeki ilginç deneyler, mühendislik prototipleri ve kampüs sırları trend müziklerle harmanlanıp sunulmalı.",
            yapilmamali: "Kurumsal hesabı tamamen başıboş bırakıp sadece saçma akımlara ayak uydurmaya çalışmamalı."
        }
    ];

    // =====================================================================
    // 🇬🇧 İNGİLİZCE VERİ SETİ
    // =====================================================================
    const akademikEN = [
        {
            baslik: "1. Academic Personnel Capacity",
            olumlu_olumsuz: "Staff quantity is positive, international diversity is negative.",
            yeterlilik: "Numerically sufficient but open to improvement in qualitative distribution.",
            neden_yeterli_yetersiz: "Student-to-faculty ratio is ideal. However, foreign academician rate is below 5%.",
            yapilmali: "Attractive employment packages should be created for academics with overseas PhDs.",
            yapilmamali: "Avoid the mistake of academic inbreeding (hiring only own graduates)."
        },
        {
            baslik: "2. Research and Innovation (R&D)",
            olumlu_olumsuz: "Number of articles is positive, patent applications and industry integration are negative.",
            yeterlilik: "Sufficient in theoretical production, inadequate in commercializing innovation.",
            neden_yeterli_yetersiz: "Scientific publications are above the global average. Conversion to industry application is very low.",
            yapilmali: "Technoparks and incubators must integrate with global industry giants.",
            yapilmamali: "Do not force academics into low-impact publications just to increase numbers."
        },
        {
            baslik: "3. International Mobility",
            olumlu_olumsuz: "Number of outgoing students is positive, full-time international student ratio is negative.",
            yeterlilik: "Adequate in exchange programs, inadequate in retaining permanent foreign talent.",
            neden_yeterli_yetersiz: "Erasmus/Exchange agreements are diverse. However, full-time international degree-seeking students are scarce.",
            yapilmali: "English-taught undergraduate programs should be increased and promoted at global fairs.",
            yapilmamali: "Do not lower global quality standards just to focus on students fleeing regional crises."
        },
        {
            baslik: "4. Physical Infrastructure",
            olumlu_olumsuz: "Classroom capacities are positive, advanced research laboratories are negative.",
            yeterlilik: "Sufficient for basic education, inadequate for highly specific research.",
            neden_yeterli_yetersiz: "Lecture halls and study areas are modern. There is a lack of equipment in niche fields like AI and biotechnology.",
            yapilmali: "Thematic laboratories should be established through private sector sponsorships.",
            yapilmamali: "Budgets should be allocated to internal hardware rather than constructing unused, flashy buildings."
        },
        {
            baslik: "5. Digital Footprint (GUV)",
            olumlu_olumsuz: "Website traffic is positive, features in international news are negative.",
            yeterlilik: "Adequate in local digital marketing, inadequate in global brand awareness.",
            neden_yeterli_yetersiz: "Organic traffic from national searches is high. However, the institution is not mentioned in US or EU media.",
            yapilmali: "Research breakthroughs should be pitched to global PR agencies via multilingual press releases.",
            yapilmamali: "Inorganic growth methods like buying social media followers should not be used."
        },
        {
            baslik: "6. Graduate Employability",
            olumlu_olumsuz: "Finding a job within the first 6 months is positive, executive roles in global companies are negative.",
            yeterlilik: "Adequate for entering the sector, open to improvement for top-tier career preparation.",
            neden_yeterli_yetersiz: "Graduate acceptance rate in local companies is high. The alumni network in Fortune 500 companies is weak.",
            yapilmali: "International internship programs and global alumni mentoring networks must be activated.",
            yapilmamali: "Education should not rely on purely theoretical curricula disconnected from the industry."
        },
        {
            baslik: "7. Financial Endowment (IPEDS)",
            olumlu_olumsuz: "State/Foundation funds are positive, endowment generation capacity is negative.",
            yeterlilik: "Sufficient for daily operations, inadequate for crisis-time growth projections.",
            neden_yeterli_yetersiz: "Annual budget targets are met. Alumni donations and patent revenues are virtually non-existent.",
            yapilmali: "An institutional Endowment fund should be established to regularly collect donations from alumni and industry.",
            yapilmamali: "Tuition fees should not be constantly raised as the only method to increase revenue."
        },
        {
            baslik: "8. Open Access (Knowledge E)",
            olumlu_olumsuz: "Database subscriptions are positive, institutional open access repository is negative.",
            yeterlilik: "Sufficient for literature review, inadequate in sharing science with the world.",
            neden_yeterli_yetersiz: "Student access to global articles is complete. Theses and articles produced by the university are closed to the public.",
            yapilmali: "An institutional DSpace/Open Archive system should be established and all academics integrated into it.",
            yapilmamali: "Academic productions should not be imprisoned solely in closed and paid journals."
        },
        {
            baslik: "9. Educational Technology",
            olumlu_olumsuz: "LMS infrastructure is positive, interactive digital content production is negative.",
            yeterlilik: "Adequate in sharing course materials, inadequate in asynchronous interactive education.",
            neden_yeterli_yetersiz: "Servers can handle thousands of students without crashing. Only PDFs are uploaded; no videos/simulations.",
            yapilmali: "AR/VR-supported virtual labs and professional studio recordings should be added to the system.",
            yapilmamali: "Distance education should not be designed as a cheap copy of formal, face-to-face education."
        },
        {
            baslik: "10. Incubation and Startups",
            olumlu_olumsuz: "Entrepreneurship courses are positive, seed-funded start-up spin-offs are negative.",
            yeterlilik: "Adequate in theoretical encouragement, inadequate in the commercialization (spin-off) phase.",
            neden_yeterli_yetersiz: "Students' business plan preparation skills are high. Ideas die because an angel investor network is not established.",
            yapilmali: "An 'Entrepreneurship Fund' should be created on campus to provide initial seed capital.",
            yapilmamali: "Entrepreneurship should not be left merely as an elective course for grading."
        },
        {
            baslik: "11. Student Support Services",
            olumlu_olumsuz: "On-campus security is positive, psychological and academic counseling are negative.",
            yeterlilik: "Adequate in physical accommodation, inadequate in mental health and guidance.",
            neden_yeterli_yetersiz: "Dorms are modern and secure. There are only 1-2 psychologists for thousands of students.",
            yapilmali: "The number of expert personnel in student support and career planning offices must be urgently increased.",
            yapilmamali: "Students' complaints regarding administrative processes should not be blocked by bureaucracy."
        },
        {
            baslik: "12. Eco-Campus & Sustainability",
            olumlu_olumsuz: "Recycling bins are positive, energy efficiency and renewable energy are negative.",
            yeterlilik: "Adequate in basic awareness, inadequate in achieving a zero-carbon footprint goal.",
            neden_yeterli_yetersiz: "Campus waste separation culture is established. Building energy consumption is high, no solar panels.",
            yapilmali: "Solar panels should be installed on roofs and smart building technologies adopted.",
            yapilmamali: "Do not settle for simply planting trees and earning a 'Green Campus' badge."
        },
        {
            baslik: "13. Inclusivity and Accessibility",
            olumlu_olumsuz: "Gender equality ratio is positive, disadvantaged and disabled access is negative.",
            yeterlilik: "Adequate in scholarship balance, inadequate in physical accessibility.",
            neden_yeterli_yetersiz: "Distribution of male/female students and academics is balanced. Campus design for visually and physically impaired is lacking.",
            yapilmali: "All buildings, websites, and course materials must conform to universal accessibility design rules.",
            yapilmamali: "Inclusivity policies should not remain merely a PR tool on paper."
        },
        {
            baslik: "14. Industrial Partnerships",
            olumlu_olumsuz: "Social responsibility projects are positive, industry-focused graduation projects are negative.",
            yeterlilik: "Adequate in civil society contribution, inadequate in solving real sector problems.",
            neden_yeterli_yetersiz: "Community service applications are very active. Engineering and business theses do not solve real corporate issues.",
            yapilmali: "Co-op educational models with industry partnerships supported by state/EU funds should be adopted.",
            yapilmamali: "The university should not be an 'ivory tower' isolated from the industry of the city it is located in."
        },
        {
            baslik: "15. Corporate Identity & Branding",
            olumlu_olumsuz: "Social media engagement is positive, academic crisis management is negative.",
            yeterlilik: "Adequate in reaching prospective students, inadequate in building scientific prestige.",
            neden_yeterli_yetersiz: "Instagram usage is highly active. The institution cannot respond professionally to negative academic criticisms.",
            yapilmali: "A specialized PR desk for science communication should be established to brand research outputs.",
            yapilmamali: "Corporate accounts should not only share the rector's visits and event posters."
        },
        {
            baslik: "16. Student Societies & Social Life",
            olumlu_olumsuz: "Club diversity is positive, budgets and facilities allocated to clubs are negative.",
            yeterlilik: "Adequate in socialization spaces, inadequate in professional event organization.",
            neden_yeterli_yetersiz: "There are many active clubs. However, clubs lack the budget to host large-scale summits.",
            yapilmali: "Legal and logistical support should be provided by the university administration to help clubs find corporate sponsorships.",
            yapilmamali: "The administration should not prevent student initiatives by excessively monitoring their activities."
        },
        {
            baslik: "17. Language Preparatory Quality",
            olumlu_olumsuz: "Grammar and reading education are positive, speaking practice is negative.",
            yeterlilik: "Adequate for passing exams, inadequate for fluent communication and academic discussion.",
            neden_yeterli_yetersiz: "Students are successful in national language exams. They struggle to present in English once in their departments.",
            yapilmali: "The number of native speaker instructors should be increased, and speaking clubs made mandatory.",
            yapilmamali: "The preparatory class should not be run like a high school test-prep course."
        },
        {
            baslik: "18. Technology Transfer (TTO)",
            olumlu_olumsuz: "Patent application processes are positive, patent commercialization and licensing are negative.",
            yeterlilik: "Adequate in bureaucratic support, inadequate in intellectual property sales.",
            neden_yeterli_yetersiz: "Academics' inventions are patented quickly. Acquired patents sit on the shelf unable to be sold to industry.",
            yapilmali: "'Technology Brokers' with private sector experience should be employed within the TTO.",
            yapilmamali: "The TTO should not turn into an approval center that complicates the academician's work."
        },
        {
            baslik: "19. Cultural and Arts Footprint",
            olumlu_olumsuz: "On-campus exhibitions are positive, hosting international festivals is negative.",
            yeterlilik: "Adequate in promoting local art, inadequate in global cultural integration.",
            neden_yeterli_yetersiz: "Internal events of the fine arts faculty are regular. Large-scale concerts/festivals that add value to the city are absent.",
            yapilmali: "The university should possess a large convention and arts center to act as the city's cultural hub.",
            yapilmamali: "The budget allocated to artistic activities should not be the first to be cut during crises."
        },
        {
            baslik: "20. Executive Agile Leadership",
            olumlu_olumsuz: "Administrative stability is positive, bottom-up agile decision-making is negative.",
            yeterlilik: "Adequate in keeping the system running, inadequate in taking innovative risks.",
            neden_yeterli_yetersiz: "The financial and administrative operations run like clockwork. Young academics have no participation in decision mechanisms.",
            yapilmali: "Young researchers and student representatives must be actively included in management boards with voting rights.",
            yapilmamali: "The university should not be managed with a hierarchical and bureaucratic government office mentality."
        }
    ];

    const sosyalEN = [
        {
            baslik: "💼 LinkedIn Corporate Network",
            olumlu_olumsuz: "Alumni and academic profiles are strong, corporate partnership posts are negative.",
            yeterlilik: "Adequate for a professional image, open to improvement in attracting industrial funds.",
            neden_yeterli_yetersiz: "The alumni network is vast and in top-tier companies. However, global marketing of technopark projects is missing.",
            yapilmali: "Patented projects of academics and university-industry successes should be highlighted as articles.",
            yapilmamali: "Do not trivialize the professional network platform by only sharing graduation ceremony photos."
        },
        {
            baslik: "📸 Instagram Visual Branding",
            olumlu_olumsuz: "Campus life and visual aesthetics are positive, academic success announcements are negative.",
            yeterlilik: "Adequate for reaching local prospects, inadequate for international elite student perception.",
            neden_yeterli_yetersiz: "Event and campus visuals receive high engagement. However, global scientific achievements are communicated poorly.",
            yapilmali: "Lab discoveries and scientific processes should be turned into popular 'Reels' videos.",
            yapilmamali: "Do not manage the corporate account frivolously as if it were a student club page."
        },
        {
            baslik: "🐦 X (Twitter) Academic Engagement",
            olumlu_olumsuz: "Scientific announcements and article linking are positive, crisis interaction management is negative.",
            yeterlilik: "Adequate for internal academic communication, inadequate for shaping public agenda.",
            neden_yeterli_yetersiz: "Academics' publications are shared with tags. Cannot respond quickly when an allegation about the school arises.",
            yapilmali: "Instant tweet threads should be posted on global trending topics using the university's expert professors' insights.",
            yapilmamali: "Do not portray an opaque, fearful corporate image by completely turning off user comments."
        },
        {
            baslik: "▶️ YouTube Video-Based Education",
            olumlu_olumsuz: "Campus promotional films are positive, open courses (MOOCs) and continuous content production are negative.",
            yeterlilik: "Adequate during annual advertising periods, inadequate in the vision of a sustainable digital library.",
            neden_yeterli_yetersiz: "Preference period videos are professionally shot. The channel is abandoned year-round; no videos are uploaded.",
            yapilmali: "Popular courses should be live-streamed and playlists created, similar to global giants like MIT and Stanford.",
            yapilmamali: "Do not make the channel a boring archive repository where only the rector's speech videos are uploaded."
        },
        {
            baslik: "🎵 TikTok Gen-Z & Prospect Engagement",
            olumlu_olumsuz: "Student-focused entertaining content is positive, corporate prestige balance is negative.",
            yeterlilik: "Adequate in appearing friendly to Gen-Z, inadequate in building a perception of reliability.",
            neden_yeterli_yetersiz: "Humorous content by campus students gets high views. However, academic weight has dropped to zero.",
            yapilmali: "Interesting experiments, engineering prototypes, and campus secrets should be blended with trending music.",
            yapilmamali: "Do not leave the corporate account completely unmonitored just to blindly follow silly trends."
        }
    ];

    // =====================================================================
    // 🇩🇪 ALMANCA VERİ SETİ (DEUTSCH - TAM ÇEVİRİ)
    // =====================================================================
    const akademikDE = [
        {
            baslik: "1. Kapazität des akademischen Personals",
            olumlu_olumsuz: "Personalquantität ist positiv, internationale Vielfalt ist negativ.",
            yeterlilik: "Zahlenmäßig ausreichend, aber verbesserungswürdig in der qualitativen Verteilung.",
            neden_yeterli_yetersiz: "Die Betreuungsrelation ist ideal. Der Anteil ausländischer Akademiker liegt jedoch unter 5%.",
            yapilmali: "Es sollten attraktive Beschäftigungspakete für Akademiker mit ausländischem Doktortitel geschnürt werden.",
            yapilmamali: "Vermeiden Sie den Fehler der akademischen Inzucht (nur eigene Absolventen einstellen)."
        },
        {
            baslik: "2. Forschung und Innovation (F&E)",
            olumlu_olumsuz: "Die Anzahl der Artikel ist positiv, Patentanmeldungen und Industrieintegration sind negativ.",
            yeterlilik: "Ausreichend in der theoretischen Produktion, unzureichend in der Kommerzialisierung.",
            neden_yeterli_yetersiz: "Wissenschaftliche Publikationen liegen über dem Durchschnitt. Die Umsetzung in die Industrie ist gering.",
            yapilmali: "Technologieparks müssen sich mit globalen Industriegiganten integrieren.",
            yapilmamali: "Zwingen Sie Akademiker nicht zu Publikationen mit geringer Wirkung, nur um Zahlen zu erhöhen."
        },
        {
            baslik: "3. Internationale Mobilität",
            olumlu_olumsuz: "Die Zahl der Auslandsstudenten ist positiv, der Anteil der internationalen Vollzeitstudenten ist negativ.",
            yeterlilik: "Ausreichend bei Austauschprogrammen, unzureichend bei der Bindung ausländischer Talente.",
            neden_yeterli_yetersiz: "Erasmus/Exchange-Vereinbarungen sind vielfältig. Es gibt jedoch kaum internationale Vollzeitstudenten.",
            yapilmali: "Englischsprachige Bachelorstudiengänge sollten ausgebaut und auf globalen Messen beworben werden.",
            yapilmamali: "Senken Sie die globalen Qualitätsstandards nicht, nur um sich auf Studenten aus Krisenregionen zu konzentrieren."
        },
        {
            baslik: "4. Physische Infrastruktur",
            olumlu_olumsuz: "Hörsaalkapazitäten sind positiv, hochmoderne Forschungslabore sind negativ.",
            yeterlilik: "Ausreichend für die Grundausbildung, unzureichend für hochspezifische Forschung.",
            neden_yeterli_yetersiz: "Hörsäle und Lernbereiche sind modern. Es fehlt an Ausrüstung in Nischenbereichen wie KI und Biotechnologie.",
            yapilmali: "Thematische Labore sollten durch Sponsoring der Privatwirtschaft eingerichtet werden.",
            yapilmamali: "Budgets sollten für die interne Hardware verwendet werden, anstatt ungenutzte Prunkbauten zu errichten."
        },
        {
            baslik: "5. Digitaler Fußabdruck (GUV)",
            olumlu_olumsuz: "Website-Traffic ist positiv, Erwähnungen in internationalen Nachrichten sind negativ.",
            yeterlilik: "Ausreichend im lokalen digitalen Marketing, unzureichend in der globalen Markenbekanntheit.",
            neden_yeterli_yetersiz: "Der organische Traffic aus nationalen Suchanfragen ist hoch. Die Institution wird jedoch in US- oder EU-Medien nicht erwähnt.",
            yapilmali: "Forschungserfolge sollten globalen PR-Agenturen über mehrsprachige Pressemitteilungen präsentiert werden.",
            yapilmamali: "Anorganische Wachstumsmethoden wie der Kauf von Social-Media-Followern sollten nicht verwendet werden."
        },
        {
            baslik: "6. Beschäftigungsfähigkeit der Absolventen",
            olumlu_olumsuz: "Die Jobfindung in den ersten 6 Monaten ist positiv, Führungspositionen in globalen Unternehmen sind negativ.",
            yeterlilik: "Ausreichend für den Berufseinstieg, verbesserungswürdig bei der Vorbereitung auf Top-Karrieren.",
            neden_yeterli_yetersiz: "Die Akzeptanzquote bei lokalen Unternehmen ist hoch. Das Alumni-Netzwerk in Fortune-500-Unternehmen ist schwach.",
            yapilmali: "Internationale Praktikumsprogramme und globale Alumni-Mentoring-Netzwerke müssen aktiviert werden.",
            yapilmamali: "Die Bildung sollte sich nicht nur auf theoretische, branchenfremde Lehrpläne stützen."
        },
        {
            baslik: "7. Finanzielle Ausstattung (IPEDS)",
            olumlu_olumsuz: "Staatliche/Stiftungs-Fonds sind positiv, die Kapazität zur Eigenkapitalgenerierung ist negativ.",
            yeterlilik: "Ausreichend für das Tagesgeschäft, unzureichend für Wachstumsprognosen in Krisenzeiten.",
            neden_yeterli_yetersiz: "Die jährlichen Budgetziele werden erreicht. Alumni-Spenden und Patenteinnahmen sind praktisch nicht vorhanden.",
            yapilmali: "Ein institutioneller Stiftungsfonds sollte eingerichtet werden, um regelmäßig Spenden von Alumni und der Industrie zu sammeln.",
            yapilmamali: "Studiengebühren sollten nicht ständig erhöht werden, um Einnahmen zu steigern."
        },
        {
            baslik: "8. Open Access (Knowledge E)",
            olumlu_olumsuz: "Datenbankabonnements sind positiv, das institutionelle Open-Access-Repositorium ist negativ.",
            yeterlilik: "Ausreichend für die Literaturrecherche, unzureichend beim Teilen von Wissenschaft mit der Welt.",
            neden_yeterli_yetersiz: "Der Zugang der Studenten zu globalen Artikeln ist vollständig. Eigene Thesen und Artikel der Universität sind für die Öffentlichkeit gesperrt.",
            yapilmali: "Ein institutionelles DSpace/Open Archive-System sollte etabliert und alle Akademiker integriert werden.",
            yapilmamali: "Akademische Produktionen sollten nicht ausschließlich in geschlossenen und kostenpflichtigen Zeitschriften eingesperrt werden."
        },
        {
            baslik: "9. Bildungstechnologie",
            olumlu_olumsuz: "Die LMS-Infrastruktur ist positiv, die Produktion interaktiver digitaler Inhalte ist negativ.",
            yeterlilik: "Ausreichend beim Teilen von Kursmaterialien, unzureichend in der asynchronen interaktiven Bildung.",
            neden_yeterli_yetersiz: "Die Server können Tausende von Studenten bewältigen, ohne abzustürzen. Es werden nur PDFs hochgeladen; keine Videos/Simulationen.",
            yapilmali: "AR/VR-unterstützte virtuelle Labore und professionelle Studioaufnahmen sollten dem System hinzugefügt werden.",
            yapilmamali: "Fernunterricht sollte nicht als billige Kopie des formalen Präsenzunterrichts konzipiert werden."
        },
        {
            baslik: "10. Inkubation und Startups",
            olumlu_olumsuz: "Entrepreneurship-Kurse sind positiv, Start-up-Gründungen mit Startkapital sind negativ.",
            yeterlilik: "Ausreichend bei theoretischer Förderung, unzureichend in der Kommerzialisierungsphase (Spin-off).",
            neden_yeterli_yetersiz: "Die Fähigkeiten der Studenten zur Erstellung von Businessplänen sind hoch. Ideen sterben, weil ein Investorennetzwerk fehlt.",
            yapilmali: "Ein 'Entrepreneurship Fund' sollte auf dem Campus eingerichtet werden, um Startkapital bereitzustellen.",
            yapilmamali: "Unternehmertum sollte nicht nur als Wahlfach zur Benotung belassen werden."
        },
        {
            baslik: "11. Studentische Unterstützungsdienste",
            olumlu_olumsuz: "Die Sicherheit auf dem Campus ist positiv, psychologische und akademische Beratung sind negativ.",
            yeterlilik: "Ausreichend bei der physischen Unterbringung, unzureichend bei der psychischen Gesundheit und Betreuung.",
            neden_yeterli_yetersiz: "Wohnheime sind modern und sicher. Es gibt nur 1-2 Psychologen für Tausende von Studenten.",
            yapilmali: "Die Anzahl des Fachpersonals in den Büros für studentische Unterstützung und Karriereplanung muss dringend erhöht werden.",
            yapilmamali: "Beschwerden von Studenten bezüglich administrativer Prozesse sollten nicht durch Bürokratie blockiert werden."
        },
        {
            baslik: "12. Öko-Campus & Nachhaltigkeit",
            olumlu_olumsuz: "Recyclingbehälter sind positiv, Energieeffizienz und erneuerbare Energien sind negativ.",
            yeterlilik: "Ausreichend im Grundbewusstsein, unzureichend beim Ziel eines Null-Carbon-Fußabdrucks.",
            neden_yeterli_yetersiz: "Die Mülltrennungskultur auf dem Campus ist etabliert. Der Energieverbrauch der Gebäude ist hoch, keine Solarpaneele.",
            yapilmali: "Solarpaneele sollten auf Dächern installiert und intelligente Gebäudetechnologien eingeführt werden.",
            yapilmamali: "Geben Sie sich nicht nur mit dem Pflanzen von Bäumen für ein 'Green Campus'-Abzeichen zufrieden."
        },
        {
            baslik: "13. Inklusivität und Zugänglichkeit",
            olumlu_olumsuz: "Geschlechtergleichstellung ist positiv, Zugang für Benachteiligte und Behinderte ist negativ.",
            yeterlilik: "Ausreichend beim Stipendiengleichgewicht, unzureichend bei der physischen Zugänglichkeit.",
            neden_yeterli_yetersiz: "Die Verteilung von Studenten und Akademikern ist ausgewogen. Das Campus-Design für Seh- und Körperbehinderte ist mangelhaft.",
            yapilmali: "Alle Gebäude, Websites und Kursmaterialien müssen den Regeln des universellen Designs entsprechen.",
            yapilmamali: "Inklusionsrichtlinien sollten nicht nur auf dem Papier existieren."
        },
        {
            baslik: "14. Industriepartnerschaften",
            olumlu_olumsuz: "Projekte zur sozialen Verantwortung sind positiv, industrieorientierte Abschlussprojekte sind negativ.",
            yeterlilik: "Ausreichend beim Beitrag zur Zivilgesellschaft, unzureichend bei der Lösung realer Sektorprobleme.",
            neden_yeterli_yetersiz: "Gemeinnützige Anwendungen sind sehr aktiv. Thesen in Ingenieurwesen und Wirtschaft lösen keine echten Unternehmensprobleme.",
            yapilmali: "Koop-Bildungsmodelle mit Industriepartnerschaften (unterstützt durch staatliche/EU-Mittel) sollten übernommen werden.",
            yapilmamali: "Die Universität sollte kein isolierter 'Elfenbeinturm' sein, fernab der Industrie ihrer Stadt."
        },
        {
            baslik: "15. Corporate Identity & Markenbildung",
            olumlu_olumsuz: "Social-Media-Engagement ist positiv, akademisches Krisenmanagement ist negativ.",
            yeterlilik: "Ausreichend, um Studieninteressierte zu erreichen, unzureichend beim Aufbau wissenschaftlichen Prestiges.",
            neden_yeterli_yetersiz: "Die Instagram-Nutzung ist sehr aktiv. Auf negative akademische Kritik kann nicht professionell reagiert werden.",
            yapilmali: "Es sollte ein spezialisierter PR-Desk für Wissenschaftskommunikation eingerichtet werden.",
            yapilmamali: "Auf offiziellen Kanälen sollten nicht nur Rektorbesuche und Veranstaltungsplakate geteilt werden."
        },
        {
            baslik: "16. Studentische Vereinigungen & Soziales Leben",
            olumlu_olumsuz: "Die Vereinsvielfalt ist positiv, die den Vereinen zugewiesenen Budgets sind negativ.",
            yeterlilik: "Ausreichend bei Räumen für Sozialisation, unzureichend bei professioneller Eventorganisation.",
            neden_yeterli_yetersiz: "Es gibt viele aktive Vereine. Jedoch fehlt den Vereinen das Budget, um groß angelegte Gipfeltreffen auszurichten.",
            yapilmali: "Logistische und rechtliche Unterstützung sollte bereitgestellt werden, damit Vereine Unternehmenssponsoren finden.",
            yapilmamali: "Die Verwaltung sollte studentische Initiativen nicht durch übermäßige Kontrolle behindern."
        },
        {
            baslik: "17. Qualität der Sprachvorbereitung",
            olumlu_olumsuz: "Grammatik- und Leseunterricht sind positiv, Sprechpraxis ist negativ.",
            yeterlilik: "Ausreichend, um Prüfungen zu bestehen, unzureichend für fließende Kommunikation und akademische Diskussionen.",
            neden_yeterli_yetersiz: "Studenten sind bei nationalen Sprachtests erfolgreich. Sie haben jedoch Schwierigkeiten, in den Fakultäten auf Englisch zu präsentieren.",
            yapilmali: "Die Anzahl der muttersprachlichen Dozenten sollte erhöht und Sprechclubs zur Pflicht gemacht werden.",
            yapilmamali: "Der Vorbereitungskurs sollte nicht wie ein Highschool-Testvorbereitungskurs geführt werden."
        },
        {
            baslik: "18. Technologietransfer (TTO)",
            olumlu_olumsuz: "Patentantragsprozesse sind positiv, Patentvermarktung und -lizenzierung sind negativ.",
            yeterlilik: "Ausreichend bei der bürokratischen Unterstützung, unzureichend beim Verkauf von geistigem Eigentum.",
            neden_yeterli_yetersiz: "Erfindungen werden schnell patentiert. Die Patente verstauben jedoch im Regal, da sie nicht verkauft werden.",
            yapilmali: "Im TTO sollten 'Technology Brokers' mit Erfahrung in der Privatwirtschaft eingesetzt werden.",
            yapilmamali: "Das TTO sollte kein Genehmigungszentrum werden, das die Arbeit der Akademiker erschwert."
        },
        {
            baslik: "19. Kultureller und Künstlerischer Fußabdruck",
            olumlu_olumsuz: "Ausstellungen auf dem Campus sind positiv, die Ausrichtung internationaler Festivals ist negativ.",
            yeterlilik: "Ausreichend bei der Förderung lokaler Kunst, unzureichend bei der globalen kulturellen Integration.",
            neden_yeterli_yetersiz: "Interne Veranstaltungen finden regelmäßig statt. Große Konzerte/Festivals, die der Stadt einen Mehrwert verleihen, fehlen.",
            yapilmali: "Die Universität sollte ein großes Kongress- und Kunstzentrum als kulturellen Knotenpunkt besitzen.",
            yapilmamali: "Das Budget für künstlerische Aktivitäten sollte bei Krisen nicht als Erstes gekürzt werden."
        },
        {
            baslik: "20. Executive Agile Leadership",
            olumlu_olumsuz: "Administrative Stabilität ist positiv, Bottom-up-Entscheidungsfindung ist negativ.",
            yeterlilik: "Ausreichend, um das System am Laufen zu halten, unzureichend, um innovative Risiken einzugehen.",
            neden_yeterli_yetersiz: "Der finanzielle und administrative Betrieb läuft wie ein Uhrwerk. Junge Akademiker sind jedoch nicht an Entscheidungen beteiligt.",
            yapilmali: "Junge Forscher und Studentenvertreter müssen mit Stimmrecht in die Leitungsgremien aufgenommen werden.",
            yapilmamali: "Die Universität sollte nicht mit einer hierarchischen und bürokratischen Behördenmentalität geführt werden."
        }
    ];

    const sosyalDE = [
        {
            baslik: "💼 LinkedIn Unternehmensnetzwerk",
            olumlu_olumsuz: "Alumni- und Akademikerprofile sind stark, Beiträge zu Unternehmenspartnerschaften sind negativ.",
            yeterlilik: "Ausreichend für ein professionelles Image, verbesserungswürdig bei der Einwerbung von Industriegeldern.",
            neden_yeterli_yetersiz: "Das Alumni-Netzwerk ist riesig und in Top-Unternehmen tätig. Die globale Vermarktung von Technologieparkprojekten fehlt jedoch.",
            yapilmali: "Patentierte Projekte von Akademikern und Erfolge zwischen Universität und Industrie sollten als Artikel hervorgehoben werden.",
            yapilmamali: "Banalisieren Sie die professionelle Netzwerkplattform nicht, indem Sie nur Fotos von Abschlussfeiern teilen."
        },
        {
            baslik: "📸 Instagram Visuelles Branding",
            olumlu_olumsuz: "Campusleben und visuelle Ästhetik sind positiv, Ankündigungen akademischer Erfolge sind negativ.",
            yeterlilik: "Ausreichend, um lokale Interessenten zu erreichen, unzureichend für das internationale Image der Elite-Studenten.",
            neden_yeterli_yetersiz: "Event- und Campus-Visuals erhalten hohes Engagement. Wissenschaftliche Errungenschaften werden jedoch schlecht kommuniziert.",
            yapilmali: "Laborerkenntnisse und wissenschaftliche Prozesse sollten in beliebte 'Reels'-Videos umgewandelt werden.",
            yapilmamali: "Verwalten Sie den offiziellen Account nicht leichtfertig, als wäre es die Seite eines Studentenclubs."
        },
        {
            baslik: "🐦 X (Twitter) Akademisches Engagement",
            olumlu_olumsuz: "Wissenschaftliche Ankündigungen und Artikelverlinkungen sind positiv, das Interaktionsmanagement in Krisen ist negativ.",
            yeterlilik: "Ausreichend für die interne akademische Kommunikation, unzureichend für die öffentliche Agenda.",
            neden_yeterli_yetersiz: "Publikationen von Akademikern werden mit Tags geteilt. Bei Vorwürfen gegen die Hochschule kann nicht schnell reagiert werden.",
            yapilmali: "Es sollten schnelle Tweet-Threads zu globalen Trendthemen mit den Erkenntnissen der Experten der Universität gepostet werden.",
            yapilmamali: "Zeichnen Sie kein undurchsichtiges, ängstliches Image, indem Sie Benutzerkommentare komplett deaktivieren."
        },
        {
            baslik: "▶️ YouTube Videobasierte Bildung",
            olumlu_olumsuz: "Campus-Werbefilme sind positiv, offene Kurse (MOOCs) und kontinuierliche Inhaltsproduktion sind negativ.",
            yeterlilik: "Ausreichend während der jährlichen Werbezeiträume, unzureichend in der Vision einer nachhaltigen digitalen Bibliothek.",
            neden_yeterli_yetersiz: "Werbevideos für die Auswahlphase sind professionell gedreht. Der Kanal wird jedoch das ganze Jahr über vernachlässigt; es werden keine Videos hochgeladen.",
            yapilmali: "Beliebte Kurse sollten live gestreamt und Playlists erstellt werden, ähnlich wie bei globalen Giganten wie MIT und Stanford.",
            yapilmamali: "Machen Sie den Kanal nicht zu einem langweiligen Archiv, in dem nur die Reden des Rektors hochgeladen werden."
        },
        {
            baslik: "🎵 TikTok Gen-Z Engagement",
            olumlu_olumsuz: "Unterhaltsame, studentenfokussierte Inhalte sind positiv, das Gleichgewicht beim Unternehmensprestige ist negativ.",
            yeterlilik: "Ausreichend, um bei der Gen-Z freundlich zu wirken, unzureichend beim Aufbau einer Wahrnehmung von Zuverlässigkeit.",
            neden_yeterli_yetersiz: "Humorvolle Inhalte der Studenten auf dem Campus erzielen hohe Aufrufe. Das akademische Gewicht ist jedoch auf null gesunken.",
            yapilmali: "Interessante Experimente, Prototypen aus den Ingenieurwissenschaften und Campus-Geheimnisse sollten mit trendiger Musik kombiniert werden.",
            yapilmamali: "Überlassen Sie den offiziellen Account nicht sich selbst, nur um blind dummen Trends zu folgen."
        }
    ];

    // =====================================================================
    // 🌍 DİL YÖNETİM MERKEZİ (Data Bank)
    // =====================================================================
    const dataBank = {
        tr: { akademik: akademikTR, sosyal: sosyalTR },
        en: { akademik: akademikEN, sosyal: sosyalEN },
        de: { akademik: akademikDE, sosyal: sosyalDE },
        fr: { akademik: akademikEN, sosyal: sosyalEN },
        ar: { akademik: akademikEN, sosyal: sosyalEN },
        zh: { akademik: akademikEN, sosyal: sosyalEN }
    };

    // =====================================================================
    // GRAFİK EKLENTİSİ VE ARAYÜZE GÖNDERİM
    // =====================================================================
    const secilenVeri = dataBank[lang] || dataBank["tr"];

    const grafikEkle = (kategori) => ({
        ...kategori,
        grafikVerisi: [
            Math.floor(Math.random() * 30) + 50, 
            Math.floor(Math.random() * 15) + 85, 
            Math.floor(Math.random() * 20) + 40  
        ]
    });

    const islenmisAkademik = secilenVeri.akademik.map(grafikEkle);
    const islenmisSosyal = secilenVeri.sosyal.map(grafikEkle);

    // Ana Tablo Verileri (Dile Göre)
    let rawScores = {};
    if (lang === "tr") {
        rawScores = {
            "GUV Görünürlük": caldwellScore,
            "IPEDS İstatistikleri": ipedsScore,
            "KnowledgeE Etkisi": knowledgeEScore,
            "Öğrenci Memnuniyeti": Math.floor(Math.random() * (100 - 70 + 1)) + 70,
            "Kariyer ve İstihdam": Math.floor(Math.random() * (100 - 65 + 1)) + 65
        };
    } else if (lang === "de") {
        rawScores = {
            "GUV Sichtbarkeit": caldwellScore,
            "IPEDS Metriken": ipedsScore,
            "KnowledgeE Einfluss": knowledgeEScore,
            "Studentenzufriedenheit": Math.floor(Math.random() * (100 - 70 + 1)) + 70,
            "Karriere & Beschäftigung": Math.floor(Math.random() * (100 - 65 + 1)) + 65
        };
    } else {
        rawScores = {
            "GUV Visibility": caldwellScore,
            "IPEDS Metrics": ipedsScore,
            "KnowledgeE Impact": knowledgeEScore,
            "Student Satisfaction": Math.floor(Math.random() * (100 - 70 + 1)) + 70,
            "Career & Employment": Math.floor(Math.random() * (100 - 65 + 1)) + 65
        };
    }

    // Özet Yazısı (Dile Göre)
    const ozetMetni = lang === "tr" 
        ? `${uniName} kurumu çapraz analize tabi tutulmuştur. İşte Akademik ve Dijital varlık kırılımı:` 
        : lang === "de"
        ? `${uniName} wurde kreuzanalysiert. Hier ist die Aufschlüsselung der akademischen und digitalen Vermögenswerte:`
        : `${uniName} has been cross-analyzed. Here is the Academic and Digital asset breakdown:`;

    res.json({
        rawScores: rawScores,
        report: {
            ozet: ozetMetni,
            akademik: islenmisAkademik, 
            sosyalMedya: islenmisSosyal 
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 Sayborn Veri Motoru Çalışıyor! Port: ${PORT}`);
    console.log(`=========================================\n`);
});