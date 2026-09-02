import type { Dictionary } from "./types";

export const vi: Dictionary = {
  meta: {
    title: "TechHala — AI đưa sản phẩm ra thị trường",
    description:
      "TechHala xây dựng các hệ thống AI có khả năng lập kế hoạch, viết, vận hành phần mềm — và mang trí tuệ đó đến robot và thiết bị biên. AI SDLC, AIOps, AI Robot và Giải pháp AI theo yêu cầu.",
    ogTitle: "TechHala — AI SDLC, AIOps, AI Robot & Giải pháp AI",
  },
  nav: {
    solutions: "Giải pháp",
    product: "HAL-SDLC",
    work: "Dự án",
    about: "Về chúng tôi",
    contact: "Liên hệ",
    bookDemo: "Đặt lịch demo",
    menu: "Menu",
    close: "Đóng",
  },
  common: {
    learnMore: "Tìm hiểu thêm",
    viewAll: "Xem tất cả",
    back: "Quay lại",
    talkToUs: "Trao đổi với chúng tôi",
    industry: "Lĩnh vực",
    challenge: "Thách thức",
    solution: "Giải pháp",
    results: "Kết quả",
    relatedSolution: "Giải pháp liên quan",
    theme: "Đổi giao diện",
    language: "Ngôn ngữ",
  },
  home: {
    hero: {
      eyebrow: "Studio kỹ thuật AI",
      title: "AI thực sự",
      highlight: "đi vào vận hành.",
      subtitle:
        "Từ ý tưởng đến sản phẩm — chúng tôi xây dựng AI có khả năng lập kế hoạch, viết, kiểm chứng và vận hành phần mềm, đồng thời mang trí tuệ đó đến robot và thế giới vật lý.",
      primaryCta: "Đặt lịch demo",
      secondaryCta: "Khám phá giải pháp",
      terminal: [
        {
          cmd: 'hal plan "Cổng khách hàng với SSO và dashboard sử dụng"',
          out: [
            "✓ Chọn mẫu: fullstack-feature",
            "✓ 6 sub-PRP, 3 giai đoạn thực thi, đã giải DAG",
            "✓ Đã viết ghi chú kiến trúc + tiêu chí chấp nhận",
          ],
        },
        {
          cmd: "hal execute",
          out: [
            "→ Giai đoạn 1/3: auth-service, schema  (2 agent)",
            "→ Giai đoạn 2/3: api, dashboard-ui     (2 agent)",
            "→ Giai đoạn 3/3: e2e-tests             (1 agent)",
          ],
        },
        {
          cmd: "hal review",
          out: [
            "10 persona · 0 P0 · 1 P2 đã tự sửa",
            "Điểm 91/100 — ĐƯỢC DUYỆT",
            "✓ Đã mở pull request với đầy đủ nhật ký kiểm toán",
          ],
        },
      ],
    },
    pillars: {
      eyebrow: "Chúng tôi làm gì",
      title: "Bốn trụ cột, một lớp trí tuệ chung",
      subtitle:
        "Dù bài toán nằm trong mã nguồn, hệ thống vận hành, nhà xưởng hay trải nghiệm khách hàng — chúng tôi áp dụng cùng một cách tiếp cận AI kỷ luật và truy vết được.",
    },
    lifecycle: {
      eyebrow: "Cách chúng tôi làm việc",
      title: "Một vòng lặp từ ý tưởng đến vận hành",
      subtitle:
        "Phần lớn công cụ AI dừng ở gợi ý mã. Chúng tôi bao phủ toàn bộ vòng đời để những gì được xây dựng cũng được kiểm chứng, triển khai và duy trì ổn định.",
      steps: [
        { name: "Ý tưởng", desc: "Biến mục tiêu mơ hồ thành các cơ hội khả thi, được xếp hạng." },
        { name: "Lập kế hoạch", desc: "Đặc tả có cấu trúc với tiêu chí chấp nhận và đồ thị phụ thuộc." },
        { name: "Xây dựng", desc: "Các agent chuyên biệt triển khai song song, theo chuẩn của bạn." },
        { name: "Kiểm chứng", desc: "Review đa góc nhìn độc lập, kiểm thử và cổng bảo mật." },
        { name: "Phát hành", desc: "Commit chuẩn, pull request và nhật ký kiểm toán đầy đủ." },
        { name: "Vận hành", desc: "AIOps giám sát production, tìm nguyên nhân gốc và tự khắc phục." },
      ],
    },
    product: {
      eyebrow: "Sản phẩm chủ lực",
      title: "HAL-SDLC — nền tảng vòng đời phát triển phần mềm bằng AI",
      body:
        "Mô tả điều bạn muốn bằng ngôn ngữ tự nhiên. HAL tạo kế hoạch có thể review, điều phối các agent chuyên biệt để xây dựng, và đưa mọi sản phẩm qua vòng review đối kháng trước khi mở pull request. Mọi quyết định đều truy vết được.",
      bullets: [
        "Kế hoạch, không phải prompt: đặc tả có cấu trúc để đội ngũ review trước khi có mã",
        "Thực thi đa agent theo các giai đoạn phụ thuộc",
        "Review đối kháng với 10 persona và chấm điểm mức độ nghiêm trọng",
        "Triển khai trong môi trường của bạn — mã nguồn không rời khỏi hệ thống",
      ],
      stats: [
        { value: "35+", label: "lệnh CLI" },
        { value: "10", label: "persona review" },
        { value: "8", label: "mẫu chuyên biệt" },
        { value: "100%", label: "quyết định truy vết được" },
      ],
      cta: "Xem HAL-SDLC",
    },
    work: {
      eyebrow: "Dự án tiêu biểu",
      title: "Giải pháp đang vận hành",
      subtitle: "Một số hệ thống chúng tôi đã thiết kế và bàn giao.",
    },
    trust: {
      title: "Xây dựng trên hệ sinh thái hiện đại và mở",
      items: [
        "OpenAI",
        "Anthropic",
        "ElevenLabs",
        "D-ID",
        "Cursor",
        "Model Context Protocol",
        "Next.js",
        "Python",
        "Kubernetes",
        "Playwright",
      ],
    },
    cta: {
      title: "Bạn có hệ thống cần xây — hay cần vận hành ổn định?",
      body: "Hãy chia sẻ với chúng tôi. Chúng tôi sẽ phản hồi bằng một phương án cụ thể, không phải một bộ slide.",
      button: "Bắt đầu trao đổi",
    },
  },
  solutions: {
    title: "Giải pháp",
    subtitle:
      "Bốn lĩnh vực chúng tôi ứng dụng AI từ đầu đến cuối — với độ kỹ thuật đủ để đưa vào vận hành thực tế.",
    sectionLabels: {
      problem: "Vấn đề",
      approach: "Cách tiếp cận",
      capabilities: "Năng lực",
      outcomes: "Kết quả",
      useCases: "Trường hợp ứng dụng",
    },
    items: [
      {
        slug: "ai-sdlc",
        name: "AI SDLC",
        tagline: "Biến ý định kinh doanh thành phần mềm truy vết được, đã review, chạy thật.",
        summary:
          "Vòng đời phát triển phần mềm dẫn dắt bởi AI: lập kế hoạch, xây dựng, kiểm chứng và phát hành với các agent chuyên biệt — con người vẫn kiểm soát mọi quyết định.",
        problem: {
          title: "Trợ lý viết mã giúp gõ nhanh hơn. Nhưng không giúp bàn giao nhanh hơn.",
          body:
            "Các đội ngũ dùng công cụ AI viết mã thấy đoạn mã ra nhanh hơn nhưng vẫn gặp nút thắt cũ: yêu cầu không rõ, đầu ra không được review, chuẩn không đồng nhất, và không có hồ sơ lý do vì sao thứ đó được xây. Kết quả: nhiều mã hơn, ít tự tin hơn.",
        },
        approach: {
          title: "Vòng đời trước, mã nguồn sau",
          steps: [
            {
              title: "Lập kế hoạch có cấu trúc",
              body: "Ý định kinh doanh trở thành kế hoạch với tiêu chí chấp nhận, ghi chú kiến trúc và đồ thị phụ thuộc — có thể review trước khi có bất kỳ dòng mã nào.",
            },
            {
              title: "Xây dựng có điều phối",
              body: "Các agent chuyên biệt triển khai song song theo giai đoạn, dựa trên quy ước, tài liệu và các quyết định trước đây của bạn.",
            },
            {
              title: "Kiểm chứng độc lập",
              body: "Agent review riêng biệt chấm điểm mọi sản phẩm về tính đúng, chất lượng, bảo mật và kiểm thử. Không có gì được merge chỉ dựa trên niềm tin.",
            },
            {
              title: "Học hỏi liên tục",
              body: "Mỗi vòng lặp ghi lại bài học vào lớp tri thức, để kế hoạch tiếp theo tốt hơn kế hoạch trước.",
            },
          ],
        },
        capabilities: [
          { title: "Nền tảng HAL-SDLC", body: "Engine của chúng tôi cho lập kế hoạch, thực thi và review bằng AI — triển khai trong môi trường của bạn." },
          { title: "Trang bị cho agent", body: "Kỹ năng, quy tắc và ngữ cảnh để agent tuân theo kiến trúc và chuẩn của bạn." },
          { title: "Lớp tri thức", body: "Tài liệu, ADR và mã nguồn của bạn được chưng cất thành wiki tra cứu được mà agent thực sự dùng." },
          { title: "Cổng chất lượng", body: "Review đa persona, kiểm toán bảo mật, sinh kiểm thử và hoàn thiện trước phát hành." },
          { title: "Tích hợp IDE & MCP", body: "Hoạt động với Cursor và mọi công cụ tương thích MCP mà lập trình viên đang dùng." },
          { title: "Chương trình triển khai", body: "Thí điểm, đo lường và mở rộng ra các đội ngũ với quản trị rõ ràng." },
        ],
        outcomes: [
          "Chu kỳ từ ý tưởng đến PR nhanh hơn, ít vòng review hơn",
          "Chuẩn đồng nhất giữa các đội ngũ và repository",
          "Nhật ký kiểm toán đầy đủ cho mọi thay đổi do AI tạo ra",
          "Lập trình viên tập trung vào phán đoán, không phải mã lặp",
        ],
        useCases: [
          "Hiện đại hóa nền tảng cũ theo từng module",
          "Xây dựng công cụ nội bộ và cổng khách hàng nhanh chóng",
          "Tăng năng suất kỹ thuật mà không tăng nhân sự",
          "Môi trường có quy định chặt cần truy vết",
        ],
        cta: "Trao đổi về thí điểm AI SDLC",
      },
      {
        slug: "aiops",
        name: "AIOps",
        tagline: "Vận hành tự phát hiện, tự giải thích và tự khắc phục.",
        summary:
          "Đưa AI vào vận hành production: phát hiện bất thường, phân tích nguyên nhân gốc, và khắc phục có hướng dẫn hoặc tự động trên hạ tầng và ứng dụng.",
        problem: {
          title: "Cảnh báo thì rẻ. Hiểu được vấn đề mới đắt.",
          body:
            "Hệ thống hiện đại sinh ra nhiều tín hiệu hơn bất kỳ đội on-call nào có thể đọc. Sự cố kéo dài hàng giờ vì phần khó không phải là thấy cảnh báo — mà là liên kết log, metric, trace và các thay đổi để tìm nguyên nhân thật.",
        },
        approach: {
          title: "Từ nhiễu đến nguyên nhân gốc đến hành động",
          steps: [
            { title: "Hợp nhất tín hiệu", body: "Kết nối metric, log, trace, triển khai và ticket vào một ngữ cảnh vận hành." },
            { title: "Phát hiện thông minh", body: "Thiết lập đường cơ sở hành vi bình thường và nổi bật bất thường thật, không phải nhiễu ngưỡng." },
            { title: "Giải thích", body: "Phân tích nguyên nhân gốc với hỗ trợ LLM, liên kết thay đổi và phụ thuộc thành một tường thuật sự cố dễ đọc." },
            { title: "Khắc phục", body: "Runbook do agent thực thi với cổng phê duyệt — từ gợi ý có hướng dẫn đến tự khắc phục hoàn toàn." },
          ],
        },
        capabilities: [
          { title: "Phát hiện bất thường", body: "Đường cơ sở thích ứng trên dịch vụ, hạ tầng và KPI kinh doanh." },
          { title: "Phân tích nguyên nhân gốc", body: "Liên kết nhận biết thay đổi với giải thích bằng ngôn ngữ tự nhiên." },
          { title: "Runbook agent", body: "Khắc phục được mã hóa với phê duyệt của con người ở những điểm quan trọng." },
          { title: "Trợ lý sự cố", body: "Trợ lý chat trả lời 'điều gì đã thay đổi?' và 'ai bị ảnh hưởng?'." },
          { title: "Dung lượng & chi phí", body: "Dự báo và khuyến nghị tối ưu kích cỡ cho chi phí cloud." },
          { title: "Tích hợp observability", body: "Hoạt động với stack hiện có — Prometheus, Grafana, Datadog, ELK và hơn nữa." },
        ],
        outcomes: [
          "Rút ngắn thời gian phát hiện và xử lý sự cố",
          "Ít cảnh báo sai cho đội on-call",
          "Báo cáo sự cố được viết ngay khi sự cố diễn ra",
          "Giảm chi phí cloud nhờ tối ưu dựa trên dữ liệu",
        ],
        useCases: [
          "Vận hành 24/7 cho nền tảng hướng khách hàng",
          "Môi trường Kubernetes và microservice",
          "Hạ tầng hybrid và multi-cloud",
          "Đội ngũ chuyển từ vận hành phản ứng sang chủ động",
        ],
        cta: "Trao đổi về đánh giá AIOps",
      },
      {
        slug: "ai-robot",
        name: "AI Robot",
        tagline: "Nhận thức và ra quyết định cho robot, camera và thiết bị biên.",
        summary:
          "Thị giác máy tính, suy luận tại biên và điều khiển agentic biến camera và robot thành hệ thống hiểu môi trường và hành động theo đó.",
        problem: {
          title: "Cảm biến ở mọi nơi, trí tuệ không ở đâu.",
          body:
            "Camera và robot thu thập lượng dữ liệu khổng lồ, nhưng phần lớn chỉ được xem lại sau khi sự việc đã xảy ra — nếu có. Biến nhận thức thành hành động kịp thời, đáng tin cậy đòi hỏi mô hình chạy tại biên và logic quyết định mà người vận hành có thể tin tưởng.",
        },
        approach: {
          title: "Nhìn, hiểu, hành động",
          steps: [
            { title: "Nhận thức", body: "Phát hiện, theo dõi và hiểu bối cảnh được tinh chỉnh cho môi trường và phần cứng của bạn." },
            { title: "Triển khai tại biên", body: "Mô hình tối ưu chạy trên thiết bị cho độ trễ thấp, riêng tư và bền vững khi mất kết nối." },
            { title: "Điều khiển agentic", body: "Logic hướng sự kiện và suy luận LLM chuyển điều nhìn thấy thành hành động an toàn, kiểm toán được." },
            { title: "Trung tâm thông minh", body: "Lớp trung tâm điều phối thiết bị, tổng hợp insight và tích hợp với hệ thống của bạn." },
          ],
        },
        capabilities: [
          { title: "Hệ thống camera AI", body: "Phân tích an toàn, kiểm tra chất lượng, mật độ và quy trình từ camera hiện có." },
          { title: "Suy luận tại biên", body: "Tối ưu và triển khai mô hình trên Jetson, ARM và gateway công nghiệp." },
          { title: "Tích hợp robot", body: "Nhận thức và lập kế hoạch tác vụ cho robot di động và robot thao tác." },
          { title: "Digital twin & mô phỏng", body: "Kiểm chứng hành vi trong mô phỏng trước khi đưa xuống xưởng." },
          { title: "Quản lý đội thiết bị", body: "Giám sát, cập nhật và vận hành thiết bị ở quy mô lớn." },
          { title: "Con người trong vòng lặp", body: "Vòng review, ghi đè và phản hồi giữ người vận hành trong tầm kiểm soát." },
        ],
        outcomes: [
          "Cảnh báo thời gian thực thay vì xem lại sau",
          "Nhất quán cao hơn trong kiểm tra và tuân thủ an toàn",
          "Dữ liệu chảy vào vận hành thay vì nằm trên ổ đĩa",
          "Hệ thống vẫn hoạt động khi mạng không",
        ],
        useCases: [
          "Giám sát chất lượng và an toàn trong sản xuất",
          "Phân tích tòa nhà thông minh, bán lẻ và logistics",
          "Robot kho vận và robot dịch vụ",
          "Kiểm tra hạ tầng",
        ],
        cta: "Trao đổi về dự án thị giác hoặc robot",
      },
      {
        slug: "ai-solutions",
        name: "Giải pháp AI",
        tagline: "Sản phẩm AI theo yêu cầu — từ trợ lý đến nội dung sinh tạo.",
        summary:
          "Thiết kế và bàn giao trọn gói ứng dụng AI: trợ lý doanh nghiệp, người bạn ảo bằng giọng nói và avatar, trung tâm tri thức và pipeline nội dung sinh tạo.",
        problem: {
          title: "Làm demo mất một ngày. Làm sản phẩm cần kỷ luật.",
          body:
            "Tạo nguyên mẫu với mô hình ngôn ngữ lớn rất dễ. Sản phẩm đáng tin cậy — bám vào dữ liệu của bạn, có rào chắn, đánh giá, kiểm soát chi phí và trải nghiệm tốt — là nơi hầu hết sáng kiến bị mắc kẹt.",
        },
        approach: {
          title: "Tư duy sản phẩm với độ kỹ thuật cao",
          steps: [
            { title: "Khám phá", body: "Xác định các trường hợp giá trị nhất và định nghĩa thành công." },
            { title: "Thiết kế", body: "Thiết kế hội thoại, giọng nói và giao diện dựa trên quy trình thực của người dùng." },
            { title: "Xây dựng", body: "Truy xuất, điều phối, đánh giá và tích hợp với hệ thống của bạn." },
            { title: "Vận hành", body: "Giám sát, quản lý chi phí và cải tiến liên tục sau khi ra mắt." },
          ],
        },
        capabilities: [
          { title: "Trợ lý doanh nghiệp", body: "Trợ lý ảo bám vào tri thức của bạn, tích hợp với công cụ của bạn." },
          { title: "Trải nghiệm giọng nói & avatar", body: "Người bạn ảo hội thoại thời gian thực với avatar sống động, khớp khẩu hình." },
          { title: "Trung tâm tri thức & RAG", body: "Biến tài liệu và dữ liệu thành câu trả lời mà đội ngũ và khách hàng tin tưởng." },
          { title: "Nội dung sinh tạo", body: "Pipeline sinh ảnh và video cho marketing, phim và nội dung sản phẩm." },
          { title: "Sản phẩm địa lý & dữ liệu", body: "Ứng dụng bản đồ và giàu dữ liệu được xây cho quy mô và khả năng tìm kiếm." },
          { title: "Đánh giá & rào chắn", body: "Chất lượng, an toàn và chi phí được đo lường liên tục." },
        ],
        outcomes: [
          "Trải nghiệm AI khách hàng thực sự dùng — và quay lại",
          "Câu trả lời bám vào dữ liệu của bạn, có nguồn",
          "Chi phí dự đoán được và chất lượng đo lường được",
          "Nền tảng bạn sở hữu, không bị phụ thuộc nhà cung cấp",
        ],
        useCases: [
          "Trợ lý chăm sóc khách hàng và bán hàng",
          "Ứng dụng bạn đồng hành và giáo dục",
          "Hệ thống tri thức và chuyên gia nội bộ",
          "Sản xuất nội dung và truyền thông",
        ],
        cta: "Trao đổi về sản phẩm AI",
      },
    ],
  },
  product: {
    eyebrow: "Sản phẩm",
    title: "HAL-SDLC",
    subtitle:
      "Vòng đời AI heuristic cho phát triển phần mềm. Mô tả ý định bằng ngôn ngữ tự nhiên — HAL lập kế hoạch, điều phối các agent chuyên biệt, review đối kháng và phát hành với nhật ký kiểm toán đầy đủ. Triển khai riêng, trong môi trường của bạn.",
    primaryCta: "Yêu cầu demo riêng",
    secondaryCta: "Khám phá cách tiếp cận AI SDLC",
    workflow: {
      title: "Cách hoạt động",
      steps: [
        { name: "Lập kế hoạch", desc: "Một câu ý định trở thành bộ kế hoạch có cấu trúc: chỉ mục, tác vụ con, ghi chú kiến trúc, tiêu chí chấp nhận và đồ thị phụ thuộc." },
        { name: "Kiểm tra", desc: "Các cổng cấu trúc chấm điểm kế hoạch trước khi ai đó viết mã. Lỗi ở tầng kế hoạch được sửa khi còn rẻ nhất." },
        { name: "Thực thi", desc: "Agent triển khai song song theo giai đoạn — kỹ sư, reviewer và planner mỗi vai trò được định nghĩa rõ." },
        { name: "Review", desc: "Reviewer độc lập với 10 persona chấm điểm mọi sản phẩm theo mức độ nghiêm trọng và độ tin cậy. Tự sửa có giới hạn xử lý các lỗi nhỏ." },
        { name: "Phát hành", desc: "Commit chuẩn, pull request và nhật ký quyết định đầy đủ — sẵn sàng cho con người phê duyệt." },
        { name: "Tích lũy", desc: "Bài học được ghi vào lớp tri thức để vòng tiếp theo bắt đầu thông minh hơn." },
      ],
    },
    features: {
      title: "Điểm khác biệt",
      items: [
        { title: "Kế hoạch đội ngũ có thể review", body: "Mọi lần xây dựng bắt đầu từ đặc tả với tiêu chí chấp nhận và bằng chứng rõ ràng — không phải từ một đoạn chat." },
        { title: "Điều phối đa agent", body: "Các giai đoạn nhận biết phụ thuộc phân công cho agent chuyên biệt và giữ chúng phối hợp." },
        { title: "Review đối kháng", body: "Các persona kiến trúc, bảo mật, hiệu năng và đối kháng review độc lập. Phát hiện kèm mức độ nghiêm trọng và độ tin cậy." },
        { title: "Tri thức ba lớp", body: "Tài liệu của bạn được chưng cất và biên dịch thành wiki liên kết mà agent tra cứu trước khi xây dựng." },
        { title: "Chế độ solo và full", body: "Luồng nhẹ cho tác vụ một lập trình viên; điều phối đầy đủ cho công việc đa dịch vụ. Cùng một chuẩn chất lượng." },
        { title: "Riêng tư mặc định", body: "Chạy trong môi trường của bạn. Tên và thuật ngữ nhạy cảm được tự động ẩn khỏi sản phẩm sinh ra." },
      ],
    },
    audiences: {
      title: "Dành cho ai",
      items: [
        { title: "Lãnh đạo kỹ thuật", body: "Mở rộng năng lực bàn giao với quản trị, chuẩn và khả năng quan sát tích hợp sẵn." },
        { title: "Đội Platform & DevEx", body: "Cung cấp cho mọi lập trình viên cùng ngữ cảnh, quy ước và cổng chất lượng." },
        { title: "Ngành có quy định chặt", body: "Truy vết từ yêu cầu đến commit đáp ứng nhu cầu kiểm toán và tuân thủ." },
      ],
    },
    delivery: {
      title: "Bàn giao & cấp phép",
      body: "HAL-SDLC được cấp phép riêng cho tổ chức và triển khai trong hạ tầng của bạn. Điều khoản thương mại, gói hỗ trợ và nhịp cập nhật được xác định theo từng hợp đồng.",
      items: [
        "Phân phối riêng — bản phát hành có tag hoặc gói nén có checksum",
        "Hoạt động với Cursor và công cụ tương thích MCP",
        "Cài đặt, onboarding và hỗ trợ theo gói",
        "Tùy chỉnh mẫu, kỹ năng và persona review (tùy chọn)",
      ],
    },
    faq: {
      title: "Câu hỏi thường gặp",
      items: [
        { q: "HAL có thay thế lập trình viên không?", a: "Không. HAL loại bỏ mã lặp và chi phí phối hợp để lập trình viên dành thời gian cho phán đoán, kiến trúc và review. Con người phê duyệt mọi pull request." },
        { q: "Hỗ trợ ngôn ngữ và stack nào?", a: "HAL độc lập stack ở tầng lập kế hoạch và review, và có sẵn mẫu cho TypeScript, Python cùng các kiến trúc web và dịch vụ phổ biến. Stack khác được bổ sung qua mẫu và bản chưng cất." },
        { q: "Mã nguồn của chúng tôi đi đâu?", a: "Không đi đâu cả. HAL chạy trong môi trường của bạn và kết nối với nhà cung cấp mô hình bạn phê duyệt. Sản phẩm sinh ra nằm trong repository của bạn." },
        { q: "Bắt đầu thế nào?", a: "Một thí điểm ngắn trên hạng mục backlog thật: chúng tôi cài HAL, cùng lập kế hoạch và thực thi, rồi đo thời gian chu kỳ và chất lượng review so với đường cơ sở của bạn." },
      ],
    },
  },
  work: {
    title: "Dự án",
    subtitle: "Các giải pháp tiêu biểu chúng tôi đã thiết kế và bàn giao. Chi tiết được chia sẻ theo NDA khi cần.",
    items: [
      {
        slug: "enterprise-virtual-assistant",
        title: "Trợ lý ảo doanh nghiệp cho tập đoàn bán lẻ",
        client: "Bán lẻ & tiêu dùng",
        industry: "Bán lẻ",
        pillar: "ai-solutions",
        summary: "Trợ lý ảo đa ngôn ngữ trả lời câu hỏi của khách hàng và nhân viên từ tri thức công ty, kết nối với hệ thống nội bộ.",
        challenge: "Đội hỗ trợ xử lý các câu hỏi lặp lại trên nhiều kênh trong khi chính sách và thông tin sản phẩm thay đổi hàng tuần. Chatbot cũ dựa trên luật và nhanh chóng lạc hậu.",
        solution: "Chúng tôi thiết kế trợ lý dựa trên truy xuất với thiết kế hội thoại theo thương hiệu, kết nối nguồn tri thức và API nội bộ, tích hợp đánh giá và chuyển tiếp cho nhân viên.",
        results: ["Câu trả lời nhất quán trên web và kênh nhắn tin", "Cập nhật tri thức không cần huấn luyện lại", "Chuyển tiếp rõ ràng cho nhân viên với đầy đủ ngữ cảnh"],
      },
      {
        slug: "voice-ai-companion",
        title: "Người bạn ảo giọng nói thời gian thực với avatar khớp khẩu hình",
        client: "Ứng dụng tiêu dùng",
        industry: "Tiêu dùng & giáo dục",
        pillar: "ai-solutions",
        summary: "Ứng dụng đồng hành hội thoại bằng giọng nói, nơi người dùng tạo nhân vật với tính cách, giọng nói và avatar động riêng.",
        challenge: "Mang lại hội thoại giọng nói tự nhiên, độ trễ thấp với avatar video biểu cảm trên iOS, Android và web — với một đội ngũ nhỏ.",
        solution: "Chúng tôi xây dựng pipeline đa phương thức — nhận dạng giọng nói, suy luận theo nhân vật, tổng hợp giọng nói chất lượng cao và video khớp khẩu hình — sau một trải nghiệm mobile-first để tạo và trò chuyện với nhân vật.",
        results: ["Phát hành đa nền tảng từ một mã nguồn", "Hội thoại nhất quán theo tính cách với giọng nói tùy chỉnh", "Avatar video đồng bộ với giọng nói sinh ra"],
      },
      {
        slug: "generative-film-pipeline",
        title: "Pipeline sinh ảnh & video cho concept phim",
        client: "Truyền thông & giải trí",
        industry: "Truyền thông",
        pillar: "ai-solutions",
        summary: "Pipeline sản xuất biến kịch bản và prompt thành hình ảnh concept nhất quán và các đoạn video ngắn.",
        challenge: "Phát triển concept phim đòi hỏi nhiều vòng lặp hình ảnh và thử chuyển động vốn chậm và tốn kém khi làm theo cách truyền thống.",
        solution: "Chúng tôi xây dựng pipeline điều phối dùng các mô hình sinh ảnh và video tiên tiến với quản lý prompt, nhất quán phong cách và quy trình review cho đội sáng tạo.",
        results: ["Vòng lặp concept tính bằng giờ thay vì tuần", "Phong cách hình ảnh nhất quán giữa các cảnh", "Đội sáng tạo tập trung vào chỉ đạo, không phải công cụ"],
      },
      {
        slug: "geospatial-heritage-platform",
        title: "Nền tảng địa lý di sản toàn quốc",
        client: "Văn hóa & du lịch",
        industry: "Công & du lịch",
        pillar: "ai-solutions",
        summary: "Danh bạ song ngữ dạng bản đồ với hơn 3.000 địa điểm văn hóa, làm giàu dữ liệu bằng AI và các trang tối ưu tìm kiếm.",
        challenge: "Thông tin địa điểm phân tán trên nhiều nguồn, không nhất quán và không có ở định dạng hiện đại, tìm kiếm được.",
        solution: "Chúng tôi xây dựng pipeline thu thập tự động và làm giàu bằng AI, bản đồ tương tác gom cụm, và hàng nghìn trang song ngữ tĩnh tối ưu cho tìm kiếm và di động.",
        results: ["3.000+ địa điểm được lập bản đồ và làm giàu", "Trang tĩnh nhanh, xếp hạng tốt cho tìm kiếm địa phương", "Nội dung song ngữ với khám phá theo tỉnh, tuyến và lễ hội"],
      },
      {
        slug: "ai-sdlc-adoption",
        title: "Engine AI SDLC tự xây dựng chính mình",
        client: "TechHala",
        industry: "Phần mềm",
        pillar: "ai-sdlc",
        summary: "Kỹ năng, agent và dịch vụ của HAL-SDLC được lập kế hoạch, xây dựng và review bởi chính HAL — bài kiểm tra mạnh nhất cho phương pháp.",
        challenge: "Chứng minh rằng lập kế hoạch bằng AI và thực thi đa agent có thể tạo ra phần mềm chất lượng production với truy vết, không chỉ là demo.",
        solution: "Mỗi năng lực mới — từ persona review đến API nội bộ — đều đi qua vòng lặp lập kế hoạch → thực thi → review → phát hành của HAL, với bài học tích lũy vào lớp tri thức.",
        results: ["Nền tảng tự khởi tạo với nhật ký quyết định đầy đủ", "Review độc lập cho mọi sản phẩm", "Phương pháp được kiểm chứng trước khi cung cấp cho khách hàng"],
      },
    ],
  },
  about: {
    title: "Về TechHala",
    subtitle: "Studio kỹ thuật AI xây dựng các hệ thống biết lập kế hoạch, xây dựng, vận hành và nhận thức.",
    mission: {
      title: "Sứ mệnh",
      body: "Biến AI thành một kỷ luật kỹ thuật đáng tin cậy — truy vết được, review được và vận hành thật — trong phần mềm, vận hành và thế giới vật lý.",
    },
    values: [
      { title: "Truy vết mặc định", body: "Mọi quyết định của AI cần có lý do đọc được và hồ sơ kiểm toán được." },
      { title: "Con người kiểm soát", body: "Agent làm việc; con người quyết định. Chúng tôi thiết kế cổng phê duyệt, không tự động hóa mù quáng." },
      { title: "Vận hành thật hơn demo", body: "Chúng tôi đo mình bằng những gì chạy ổn định cho người dùng, không phải thứ đẹp trong video." },
      { title: "Học hỏi tích lũy", body: "Mỗi dự án đưa tri thức vào dự án tiếp theo — cho chúng tôi và cho khách hàng." },
    ],
    story: {
      title: "Câu chuyện",
      paragraphs: [
        "TechHala bắt đầu từ một trăn trở đơn giản: AI có thể viết mã, nhưng không ai giải thích được vì sao nó viết như vậy — hay đủ tin tưởng để phát hành. Chúng tôi bắt tay xây dựng vòng đời còn thiếu quanh AI: lập kế hoạch, kiểm chứng và vận hành.",
        "Công việc đó trở thành HAL-SDLC, engine vòng đời phát triển phần mềm bằng AI của chúng tôi, và định hình cách chúng tôi tiếp cận mọi bài toán — từ giữ hệ thống production ổn định đến dạy camera và robot hành động theo những gì chúng nhìn thấy.",
        "Hôm nay chúng tôi hợp tác với các tổ chức tại Việt Nam và quốc tế để thiết kế, xây dựng và vận hành các hệ thống AI đứng vững trong thế giới thực.",
      ],
    },
    stats: [
      { value: "4", label: "trụ cột giải pháp" },
      { value: "1", label: "nền tảng chủ lực" },
      { value: "VN + Toàn cầu", label: "khách hàng phục vụ" },
      { value: "100%", label: "bàn giao có con người phê duyệt" },
    ],
  },
  contact: {
    title: "Hãy trao đổi",
    subtitle: "Chia sẻ về hệ thống bạn muốn xây dựng hoặc vận hành. Chúng tôi phản hồi trong hai ngày làm việc với bước tiếp theo cụ thể.",
    form: {
      name: "Họ tên",
      email: "Email công việc",
      company: "Công ty",
      topic: "Tôi quan tâm đến",
      topics: ["AI SDLC / HAL-SDLC", "AIOps", "AI Robot & Thị giác", "Giải pháp AI", "Hợp tác", "Khác"],
      message: "Bạn đang làm gì?",
      submit: "Gửi tin nhắn",
      sending: "Đang gửi…",
      success: "Cảm ơn — chúng tôi đã nhận được tin nhắn và sẽ liên hệ sớm.",
      error: "Có lỗi xảy ra. Vui lòng gửi email trực tiếp cho chúng tôi.",
    },
    aside: {
      title: "Muốn gửi email?",
      body: "Liên hệ trực tiếp với đội ngũ, chúng tôi sẽ chuyển đến đúng người.",
      email: "hello@techhala.com",
      location: "Việt Nam · làm việc với khách hàng toàn cầu",
    },
  },
  footer: {
    tagline: "AI đi vào vận hành — trong phần mềm, vận hành và thế giới vật lý.",
    solutions: "Giải pháp",
    company: "Công ty",
    rights: "Bảo lưu mọi quyền.",
  },
};
