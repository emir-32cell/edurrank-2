import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

// Grafik kütüphaneleri (JFreeChart gerektirir)
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DefaultPieDataset;

// Veri çekme kütüphanesi (Jsoup gerektirir)
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public class UniversityAnalyzerApp extends JFrame {

    private JTextField uniNameField;
    private JTextArea reportArea;
    private JPanel chartPanelContainer;

    // Tarayıcı taklidi yapmak için User-Agent
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

    public UniversityAnalyzerApp() {
        setTitle("Üniversite Veri Çekme ve Analiz Sistemi");
        setSize(1200, 800);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        // --- SOL PANEL: GİRDİLER ---
        JPanel inputPanel = new JPanel(new BorderLayout());
        inputPanel.setPreferredSize(new Dimension(300, 0));
        inputPanel.setBorder(BorderFactory.createTitledBorder("⚙️ Ayarlar & Arama"));

        // Manuel link alanını kaldırdık, sadece üniversite adı kaldı
        JPanel formPanel = new JPanel(new GridLayout(2, 1, 5, 5));
        
        formPanel.add(new JLabel("Analiz Edilecek Üniversite (Örn: Univ. of Toronto):"));
        uniNameField = new JTextField();
        formPanel.add(uniNameField);

        JButton analyzeButton = new JButton("🚀 Verileri Çek ve Analiz Et");
        
        inputPanel.add(formPanel, BorderLayout.NORTH);
        inputPanel.add(analyzeButton, BorderLayout.SOUTH);
        add(inputPanel, BorderLayout.WEST);

        // --- SAĞ PANEL: RAPOR VE GRAFİKLER ---
        JPanel mainContentPanel = new JPanel(new BorderLayout());
        
        reportArea = new JTextArea();
        reportArea.setEditable(false);
        reportArea.setFont(new Font("Monospaced", Font.PLAIN, 14));
        JScrollPane reportScroll = new JScrollPane(reportArea);
        reportScroll.setPreferredSize(new Dimension(0, 250));
        reportScroll.setBorder(BorderFactory.createTitledBorder("📝 Detaylı Analiz Raporu"));
        
        chartPanelContainer = new JPanel(new GridLayout(1, 2));
        chartPanelContainer.setBorder(BorderFactory.createTitledBorder("📊 Görsel Analizler"));

        mainContentPanel.add(chartPanelContainer, BorderLayout.CENTER);
        mainContentPanel.add(reportScroll, BorderLayout.SOUTH);
        
        add(mainContentPanel, BorderLayout.CENTER);

        // --- BUTON AKSİYONU ---
        analyzeButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String uniName = uniNameField.getText().trim();
                if (uniName.isEmpty()) {
                    JOptionPane.showMessageDialog(null, "Lütfen bir üniversite adı gir kanka!", "Uyarı", JOptionPane.WARNING_MESSAGE);
                    return;
                }
                
                // Butonu deaktif et ki arka arkaya basılmasın
                analyzeButton.setEnabled(false);
                analyzeButton.setText("⏳ Veriler Çekiliyor...");

                // Arayüzü dondurmamak için arka plan iş parçacığı (SwingWorker) kullanıyoruz
                SwingWorker<Map<String, Integer>, Void> worker = new SwingWorker<Map<String, Integer>, Void>() {
                    @Override
                    protected Map<String, Integer> doInBackground() throws Exception {
                        // 1. Veri Çekme İşlemi
                        return scrapeUniversityData(uniName);
                    }

                    @Override
                    protected void done() {
                        try {
                            Map<String, Integer> data = get();
                            // 2. Raporlama ve Grafikleri Güncelleme
                            generateReportAndCharts(uniName, data);
                        } catch (Exception ex) {
                            ex.printStackTrace();
                            JOptionPane.showMessageDialog(null, "Veri çekilirken hata oluştu!", "Hata", JOptionPane.ERROR_MESSAGE);
                        } finally {
                            analyzeButton.setEnabled(true);
                            analyzeButton.setText("🚀 Verileri Çek ve Analiz Et");
                        }
                    }
                };
                worker.execute();
            }
        });
    }

    // 1. VERİ ÇEKME FONKSİYONU (Arka plan entegrasyonu)
    private Map<String, Integer> scrapeUniversityData(String uniName) {
        Map<String, Integer> data = new HashMap<>();
        Random rand = new Random(); // Şimdilik simüle edilen veriler için
        
        // 1. American Caldwell (GUV) Görünürlük Skoru
        int guvScore = fetchCaldwellGuvRankings(uniName);
        data.put("GUV Görünürlük Skoru", guvScore > 0 ? guvScore : 70 + rand.nextInt(30));

        // 2. IPEDS Veritabanı
        int ipedsScore = fetchIpedsData(uniName);
        data.put("IPEDS İstatistikleri", ipedsScore > 0 ? ipedsScore : 65 + rand.nextInt(25));

        // 3. Knowledge E Etkisi
        int knowledgeScore = fetchKnowledgeEInsights();
        data.put("KnowledgeE Etki Skoru", knowledgeScore > 0 ? knowledgeScore : 60 + rand.nextInt(35));

        // Diğer varsayılan grafik verileri
        data.put("Öğrenci Memnuniyeti", 40 + rand.nextInt(46));
        data.put("Kariyer ve İş Bulma", 70 + rand.nextInt(29));
        
        return data;
    }

    // --- SİMON'IN KAYNAKLARI İÇİN SCRAPING METOTLARI ---

    private int fetchCaldwellGuvRankings(String uniName) {
        String url = "https://americancaldwell.com/guv-rankings";
        try {
            Document doc = Jsoup.connect(url).userAgent(USER_AGENT).get();
            // TODO: DOM'dan ilgili üniversitenin skorunu çekecek (Örn: doc.select(...))
            // Şimdilik işlemi simüle ediyoruz
            System.out.println("Caldwell GUV verisine bağlanıldı: " + uniName);
            return 85; 
        } catch (IOException e) {
            System.err.println("Caldwell hatası: " + e.getMessage());
            return 0;
        }
    }

    private int fetchIpedsData(String uniName) {
        String baseUrl = "https://nces.ed.gov/ipeds/datacenter/InstitutionByName.aspx";
        try {
            // Viewstate id'yi atlatıp POST atmak için session mantığı
            Connection.Response initialResponse = Jsoup.connect(baseUrl)
                    .userAgent(USER_AGENT)
                    .method(Connection.Method.GET)
                    .execute();
            
            Document initialDoc = initialResponse.parse();
            Element viewStateElem = initialDoc.selectFirst("input[name=__VIEWSTATE]");
            String viewState = (viewStateElem != null) ? viewStateElem.attr("value") : "";
            
            System.out.println("IPEDS Session'ı başlatıldı: " + uniName);
            return 78;
        } catch (IOException e) {
            System.err.println("IPEDS hatası: " + e.getMessage());
            return 0;
        }
    }

    private int fetchKnowledgeEInsights() {
        String url = "https://knowledgee.com/";
        try {
            Document doc = Jsoup.connect(url).userAgent(USER_AGENT).get();
            System.out.println("Knowledge E sitesine bağlanıldı.");
            return 92;
        } catch (IOException e) {
            System.err.println("Knowledge E hatası: " + e.getMessage());
            return 0;
        }
    }

    // 2. ANALİZ VE RAPORLAMA FONKSİYONU
    private void generateReportAndCharts(String uniName, Map<String, Integer> data) {
        StringBuilder reportBuilder = new StringBuilder();
        reportBuilder.append("===").append(uniName).append(" Değerlendirme Raporu ===\n\n");
        
        reportBuilder.append("✅ Güçlü Yönler (Olumlu):\n");
        boolean hasPros = false;
        for (Map.Entry<String, Integer> entry : data.entrySet()) {
            if (entry.getValue() >= 75) {
                reportBuilder.append("- ").append(entry.getKey()).append(" (Skor: ").append(entry.getValue())
                             .append("): İyi, çünkü bu alanda standartların oldukça üzerinde.\n");
                hasPros = true;
            }
        }
        if (!hasPros) reportBuilder.append("- Belirgin bir güçlü yön tespit edilemedi.\n");

        reportBuilder.append("\n⚠️ Gelişime Açık Yönler (Olumsuz):\n");
        boolean hasCons = false;
        for (Map.Entry<String, Integer> entry : data.entrySet()) {
            if (entry.getValue() < 75) {
                reportBuilder.append("- ").append(entry.getKey()).append(" (Skor: ").append(entry.getValue())
                             .append("): Yetersiz, çünkü bu alanda acil geliştirmeye ihtiyaç var.\n");
                hasCons = true;
            }
        }
        if (!hasCons) reportBuilder.append("- Kritik bir zayıf yön tespit edilemedi.\n");

        reportArea.setText(reportBuilder.toString());

        // --- GRAFİKLERİ ÇİZİMİ ---
        chartPanelContainer.removeAll();

        // Sütun Grafiği (Bar Chart)
        DefaultCategoryDataset barDataset = new DefaultCategoryDataset();
        for (Map.Entry<String, Integer> entry : data.entrySet()) {
            barDataset.addValue(entry.getValue(), "Skor", entry.getKey());
        }
        JFreeChart barChart = ChartFactory.createBarChart(
                "Kriter Skorları", "Kriter", "Skor (0-100)", barDataset);
        chartPanelContainer.add(new ChartPanel(barChart));

        // Pasta Grafiği (Pie/Donut Chart)
        DefaultPieDataset pieDataset = new DefaultPieDataset();
        for (Map.Entry<String, Integer> entry : data.entrySet()) {
            pieDataset.setValue(entry.getKey(), entry.getValue());
        }
        JFreeChart pieChart = ChartFactory.createPieChart(
                "Ağırlıklı Dağılım", pieDataset, true, true, false);
        chartPanelContainer.add(new ChartPanel(pieChart));

        chartPanelContainer.revalidate();
        chartPanelContainer.repaint();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new UniversityAnalyzerApp().setVisible(true);
        });
    }
}