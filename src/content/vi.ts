import type { Dictionary } from "./types";

export const vi: Dictionary = {
  meta: {
    title: "TechHala — AI đưa sản phẩm ra thị trường",
    description:
      "TechHala xây dựng robot thông minh cho giáo dục, phát triển phần mềm dẫn dắt bởi AI và dịch vụ AI cho doanh nghiệp — chatbot, trợ lý và nền tảng AI riêng đưa vào vận hành thực tế.",
    ogTitle: "TechHala — AI Robot, AI cho SDLC & AI cho Doanh nghiệp",
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
        "Chúng tôi xây dựng trí tuệ biết dạy học qua robot, biết lập kế hoạch, viết và kiểm chứng phần mềm, và vận hành như những dịch vụ AI đáng tin cậy trong doanh nghiệp.",
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
      title: "Ba trọng tâm, một lớp trí tuệ chung",
      subtitle:
        "Dù bài toán nằm trong lớp học, trong mã nguồn hay trải rộng khắp tổ chức của bạn — chúng tôi áp dụng cùng một cách tiếp cận AI kỷ luật, sẵn sàng cho vận hành thực tế.",
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
        { name: "Vận hành", desc: "Giám sát, đánh giá và cải tiến dịch vụ AI và hệ thống trong production." },
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
      "Ba lĩnh vực chúng tôi ứng dụng AI từ đầu đến cuối — với độ kỹ thuật đủ để đưa vào vận hành thực tế.",
    sectionLabels: {
      problem: "Vấn đề",
      approach: "Cách tiếp cận",
      capabilities: "Năng lực",
      outcomes: "Kết quả",
      useCases: "Trường hợp ứng dụng",
    },
    items: [
      {
        slug: "ai-robot",
        name: "AI Robot",
        tagline: "Robot thông minh biết dạy, biết trò chuyện và học cùng con người.",
        summary:
          "Chúng tôi xây dựng lớp trí tuệ cho robot giáo dục và robot dịch vụ: hội thoại tự nhiên, giọng nói và thị giác, gia sư thích ứng — bắt đầu với robot giúp trẻ em và người lớn học tiếng Anh.",
        problem: {
          title: "Robot biết di chuyển. Rất ít robot biết trò chuyện có ý nghĩa.",
          body:
            "Phần lớn robot giáo dục chạy các hội thoại kịch bản mà trẻ chán chỉ sau một tuần, còn người học ngoại ngữ hiếm khi có đủ cơ hội luyện nói với một người bạn kiên nhẫn. Phần cứng đã có — điều còn thiếu là trí tuệ biết lắng nghe, hiểu, thích ứng với từng người học và an toàn cho lớp học lẫn gia đình.",
        },
        approach: {
          title: "Lắng nghe, hiểu, dạy, thích ứng",
          steps: [
            { title: "Hội thoại tự nhiên", body: "Giọng nói sang giọng nói độ trễ thấp với tính cách nhất quán, để robot giống một người bạn đồng hành, không phải một menu." },
            { title: "Sư phạm tích hợp", body: "Giáo án, lộ trình từ vựng, phản hồi phát âm và trò chơi được thiết kế cùng giáo viên, bám theo khung CEFR." },
            { title: "Nhận thức & hiện diện", body: "Thị giác và giọng nói giúp robot nhận ra người học, đọc mức độ tập trung và phản hồi bằng biểu cảm, cử chỉ." },
            { title: "Học từ mỗi buổi", body: "Theo dõi tiến độ cho giáo viên và phụ huynh; gia sư điều chỉnh độ khó và chủ đề theo từng người học." },
          ],
        },
        capabilities: [
          { title: "Bạn đồng hành học tiếng Anh", body: "Luyện hội thoại, sửa phát âm, trò chơi từ vựng và kể chuyện — tối ưu cho trẻ em và người học trưởng thành." },
          { title: "Bộ não hội thoại", body: "Nhận dạng giọng nói, suy luận LLM có rào chắn và tổng hợp giọng nói biểu cảm — chạy trên thiết bị hoặc hybrid." },
          { title: "Thị giác & tương tác", body: "Nhận dạng khuôn mặt, cử chỉ, tín hiệu tập trung và nhận dạng vật thể cho bài học tương tác." },
          { title: "Bảng điều khiển giáo viên & phụ huynh", body: "Tóm tắt buổi học, tiến độ theo kỹ năng và kiểm soát nội dung." },
          { title: "Tích hợp robot & phần cứng", body: "Tích hợp với robot hình người, robot để bàn và robot di động — chuyển động, LED, màn hình và cảm biến." },
          { title: "An toàn & riêng tư", body: "Bộ lọc nội dung theo độ tuổi, xử lý trên thiết bị khi có thể và quy trình đồng ý của phụ huynh." },
        ],
        outcomes: [
          "Nhiều thời gian luyện nói cho mỗi người học hơn bất kỳ lớp học nào",
          "Sự hứng thú kéo dài sau tuần đầu tò mò",
          "Tiến độ đo lường được cho giáo viên và phụ huynh",
          "Một nền tảng trí tuệ dùng chung cho nhiều mẫu robot",
        ],
        useCases: [
          "Robot học tiếng Anh cho trường mầm non và tiểu học",
          "Bạn đồng hành gia sư tại nhà cho trẻ em",
          "Trung tâm ngoại ngữ và kiosk tự học",
          "Robot lễ tân, bảo tàng và dịch vụ trò chuyện tự nhiên",
        ],
        cta: "Trao đổi về dự án robot giáo dục",
      },
      {
        slug: "ai-sdlc",
        name: "AI cho SDLC",
        tagline: "Biến ý định kinh doanh thành phần mềm truy vết được, đã review, chạy thật.",
        summary:
          "Vòng đời phát triển phần mềm dẫn dắt bởi AI: lập kế hoạch, xây dựng, kiểm chứng và phát hành với các agent chuyên biệt — con người vẫn kiểm soát mọi quyết định. Vận hành trên nền tảng HAL-SDLC của chúng tôi.",
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
        slug: "ai-enterprise",
        name: "AI cho Doanh nghiệp",
        tagline: "Chatbot, trợ lý và dịch vụ AI triển khai an toàn trong tổ chức của bạn.",
        summary:
          "Từ chatbot phục vụ khách hàng đến copilot nội bộ và nền tảng AI riêng — chúng tôi thiết kế, xây dựng, triển khai và vận hành các dịch vụ AI phù hợp với dữ liệu, hệ thống và yêu cầu tuân thủ của bạn.",
        problem: {
          title: "Làm demo mất một ngày. Đưa dịch vụ AI vào vận hành cần kỷ luật.",
          body:
            "Tạo nguyên mẫu với mô hình ngôn ngữ lớn rất dễ. Dịch vụ doanh nghiệp đáng tin cậy — bám vào dữ liệu của bạn, tích hợp với hệ thống, bảo mật, được đánh giá, kiểm soát chi phí và giám sát trong production — là nơi hầu hết sáng kiến bị mắc kẹt.",
        },
        approach: {
          title: "Từ bài toán đến dịch vụ đang chạy",
          steps: [
            { title: "Khám phá", body: "Xác định các trường hợp giá trị nhất, nguồn dữ liệu và chỉ số thành công cùng đội kinh doanh và CNTT." },
            { title: "Thiết kế", body: "Thiết kế hội thoại, kiến trúc tri thức và bản thiết kế tích hợp phù hợp bảo mật và tuân thủ." },
            { title: "Xây dựng & tích hợp", body: "Truy xuất, điều phối, rào chắn và kết nối với CRM, ERP, hệ thống ticket và định danh." },
            { title: "Triển khai & vận hành", body: "Triển khai riêng hoặc hybrid, giám sát, quản lý chi phí, đánh giá và cải tiến liên tục." },
          ],
        },
        capabilities: [
          { title: "Chatbot chăm sóc khách hàng", body: "Trợ lý đa ngôn ngữ cho web, ứng dụng và kênh nhắn tin — bám vào tri thức của bạn, có chuyển tiếp cho nhân viên." },
          { title: "Trợ lý & copilot cho nhân viên", body: "Copilot nội bộ cho nhân sự, CNTT, kinh doanh và vận hành: trả lời từ chính sách và thao tác trong công cụ của bạn." },
          { title: "Trung tâm tri thức & RAG", body: "Tài liệu, cơ sở dữ liệu và ticket biến thành câu trả lời tin cậy có trích dẫn và phân quyền." },
          { title: "Nền tảng AI riêng", body: "LLM gateway, lưu trữ mô hình và hạ tầng vector triển khai trên cloud của bạn hoặc tại chỗ." },
          { title: "Vận hành dịch vụ AI", body: "Giám sát, đánh giá, kiểm soát chi phí và xử lý sự cố cho AI trong production — bao gồm AIOps cho nền tảng của bạn." },
          { title: "Nội dung sinh tạo & sản phẩm dữ liệu", body: "Pipeline sinh ảnh, video, tài liệu và các ứng dụng giàu dữ liệu được xây cho quy mô lớn." },
        ],
        outcomes: [
          "Trợ lý giải quyết yêu cầu, không chỉ né tránh",
          "Câu trả lời bám vào dữ liệu của bạn, có nguồn và tôn trọng phân quyền",
          "Chi phí dự đoán được và chất lượng đo lường được sau khi ra mắt",
          "Nền tảng bạn sở hữu — không phụ thuộc nhà cung cấp",
        ],
        useCases: [
          "Trợ lý hỗ trợ khách hàng và bán hàng cho bán lẻ, ngân hàng, viễn thông",
          "Trợ lý tri thức nội bộ cho tổ chức lớn",
          "Triển khai dịch vụ LLM riêng cho ngành có quy định chặt",
          "Nền tảng nội dung, truyền thông và dữ liệu vận hành bằng AI sinh tạo",
        ],
        cta: "Trao đổi về dự án AI doanh nghiệp",
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
        pillar: "ai-enterprise",
        summary: "Trợ lý ảo đa ngôn ngữ trả lời câu hỏi của khách hàng và nhân viên từ tri thức công ty, kết nối với hệ thống nội bộ.",
        challenge: "Đội hỗ trợ xử lý các câu hỏi lặp lại trên nhiều kênh trong khi chính sách và thông tin sản phẩm thay đổi hàng tuần. Chatbot cũ dựa trên luật và nhanh chóng lạc hậu.",
        solution: "Chúng tôi thiết kế trợ lý dựa trên truy xuất với thiết kế hội thoại theo thương hiệu, kết nối nguồn tri thức và API nội bộ, tích hợp đánh giá và chuyển tiếp cho nhân viên.",
        results: ["Câu trả lời nhất quán trên web và kênh nhắn tin", "Cập nhật tri thức không cần huấn luyện lại", "Chuyển tiếp rõ ràng cho nhân viên với đầy đủ ngữ cảnh"],
      },
      {
        slug: "voice-ai-companion",
        title: "Người bạn ảo giọng nói thời gian thực để luyện hội thoại",
        client: "Ứng dụng tiêu dùng",
        industry: "Giáo dục & tiêu dùng",
        pillar: "ai-robot",
        summary: "Ứng dụng đồng hành giọng nói sang giọng nói, nơi người học trò chuyện với nhân vật có tính cách, giọng nói và khuôn mặt động riêng — chính bộ não hội thoại chúng tôi mang vào robot giáo dục.",
        challenge: "Mang lại hội thoại giọng nói tự nhiên, độ trễ thấp với avatar biểu cảm khớp khẩu hình trên iOS, Android và web — đủ hấp dẫn để người học tiếp tục luyện tập.",
        solution: "Chúng tôi xây dựng pipeline đa phương thức — nhận dạng giọng nói, suy luận theo nhân vật có rào chắn, tổng hợp giọng nói chất lượng cao và video khớp khẩu hình — sau một trải nghiệm mobile-first để tạo và trò chuyện với nhân vật.",
        results: ["Phát hành đa nền tảng từ một mã nguồn", "Hội thoại nhất quán theo tính cách với giọng nói tùy chỉnh", "Cùng pipeline nay vận hành hội thoại và gia sư trên robot"],
      },
      {
        slug: "generative-film-pipeline",
        title: "Pipeline sinh ảnh & video cho concept phim",
        client: "Truyền thông & giải trí",
        industry: "Truyền thông",
        pillar: "ai-enterprise",
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
        pillar: "ai-enterprise",
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
    subtitle: "Studio kỹ thuật AI xây dựng trí tuệ cho robot, đội ngũ phần mềm và doanh nghiệp.",
    mission: {
      title: "Sứ mệnh",
      body: "Biến AI thành một kỷ luật kỹ thuật đáng tin cậy — truy vết được, review được và vận hành thật — dù là dạy một em nhỏ, xây phần mềm hay phục vụ một tổ chức.",
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
        "Công việc đó trở thành HAL-SDLC, engine vòng đời phát triển phần mềm bằng AI của chúng tôi, và định hình cách chúng tôi tiếp cận mọi bài toán — từ triển khai dịch vụ AI trong doanh nghiệp đến trao cho robot giáo dục một giọng nói biết lắng nghe, hiểu và dạy.",
        "Hôm nay chúng tôi hợp tác với các tổ chức tại Việt Nam và quốc tế để thiết kế, xây dựng và vận hành các hệ thống AI đứng vững trong thế giới thực.",
      ],
    },
    stats: [
      { value: "3", label: "lĩnh vực trọng tâm" },
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
      topics: ["AI Robot / Giáo dục", "AI cho SDLC / HAL-SDLC", "AI cho Doanh nghiệp", "Hợp tác", "Khác"],
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
    tagline: "AI đi vào vận hành — cho robot, đội ngũ phần mềm và doanh nghiệp.",
    solutions: "Giải pháp",
    company: "Công ty",
    rights: "Bảo lưu mọi quyền.",
  },
};
