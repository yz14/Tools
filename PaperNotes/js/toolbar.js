/**
 * PaperNotes - Toolbar Data
 * Math symbols and templates for the editing sidebars
 */

const TOOLBAR_DATA = {
    left: [
        {
            title: "希腊字母 (小写)",
            collapsed: false,
            layout: "grid",
            items: [
                { text: "α", latex: "\\alpha" },
                { text: "β", latex: "\\beta" },
                { text: "γ", latex: "\\gamma" },
                { text: "δ", latex: "\\delta" },
                { text: "ε", latex: "\\epsilon" },
                { text: "ϵ", latex: "\\varepsilon" },
                { text: "ζ", latex: "\\zeta" },
                { text: "η", latex: "\\eta" },
                { text: "θ", latex: "\\theta" },
                { text: "ϑ", latex: "\\vartheta" },
                { text: "ι", latex: "\\iota" },
                { text: "κ", latex: "\\kappa" },
                { text: "λ", latex: "\\lambda" },
                { text: "μ", latex: "\\mu" },
                { text: "ν", latex: "\\nu" },
                { text: "ξ", latex: "\\xi" },
                { text: "π", latex: "\\pi" },
                { text: "ϖ", latex: "\\varpi" },
                { text: "ρ", latex: "\\rho" },
                { text: "ϱ", latex: "\\varrho" },
                { text: "σ", latex: "\\sigma" },
                { text: "ς", latex: "\\varsigma" },
                { text: "τ", latex: "\\tau" },
                { text: "υ", latex: "\\upsilon" },
                { text: "φ", latex: "\\phi" },
                { text: "ϕ", latex: "\\varphi" },
                { text: "χ", latex: "\\chi" },
                { text: "ψ", latex: "\\psi" },
                { text: "ω", latex: "\\omega" },
                { text: "ϝ", latex: "\\digamma" }
            ]
        },
        {
            title: "希腊字母 (大写)",
            collapsed: true,
            layout: "grid",
            items: [
                { text: "Γ", latex: "\\Gamma" },
                { text: "Δ", latex: "\\Delta" },
                { text: "Θ", latex: "\\Theta" },
                { text: "Λ", latex: "\\Lambda" },
                { text: "Ξ", latex: "\\Xi" },
                { text: "Π", latex: "\\Pi" },
                { text: "Σ", latex: "\\Sigma" },
                { text: "Υ", latex: "\\Upsilon" },
                { text: "Φ", latex: "\\Phi" },
                { text: "Ψ", latex: "\\Psi" },
                { text: "Ω", latex: "\\Omega" }
            ]
        },
        {
            title: "运算符",
            collapsed: true,
            layout: "grid",
            items: [
                { text: "∑", latex: "\\sum" },
                { text: "∏", latex: "\\prod" },
                { text: "∐", latex: "\\coprod" },
                { text: "∫", latex: "\\int" },
                { text: "∬", latex: "\\iint" },
                { text: "∭", latex: "\\iiint" },
                { text: "∮", latex: "\\oint" },
                { text: "∇", latex: "\\nabla" },
                { text: "∂", latex: "\\partial" },
                { text: "∞", latex: "\\infty" },
                { text: "±", latex: "\\pm" },
                { text: "∓", latex: "\\mp" },
                { text: "×", latex: "\\times" },
                { text: "÷", latex: "\\div" },
                { text: "·", latex: "\\cdot" },
                { text: "∗", latex: "\\ast" },
                { text: "⋆", latex: "\\star" },
                { text: "∘", latex: "\\circ" },
                { text: "•", latex: "\\bullet" },
                { text: "⊕", latex: "\\oplus" },
                { text: "⊖", latex: "\\ominus" },
                { text: "⊗", latex: "\\otimes" },
                { text: "⊘", latex: "\\oslash" },
                { text: "⊙", latex: "\\odot" },
                { text: "⋃", latex: "\\bigcup" },
                { text: "⋂", latex: "\\bigcap" },
                { text: "⨄", latex: "\\biguplus" },
                { text: "⨆", latex: "\\bigsqcup" }
            ]
        },
        {
            title: "关系符号",
            collapsed: true,
            layout: "grid",
            items: [
                { text: "≤", latex: "\\leq" },
                { text: "≥", latex: "\\geq" },
                { text: "≪", latex: "\\ll" },
                { text: "≫", latex: "\\gg" },
                { text: "≠", latex: "\\neq" },
                { text: "≡", latex: "\\equiv" },
                { text: "≈", latex: "\\approx" },
                { text: "∼", latex: "\\sim" },
                { text: "≃", latex: "\\simeq" },
                { text: "≅", latex: "\\cong" },
                { text: "∝", latex: "\\propto" },
                { text: "∈", latex: "\\in" },
                { text: "∉", latex: "\\notin" },
                { text: "∋", latex: "\\ni" },
                { text: "⊂", latex: "\\subset" },
                { text: "⊃", latex: "\\supset" },
                { text: "⊆", latex: "\\subseteq" },
                { text: "⊇", latex: "\\supseteq" },
                { text: "∩", latex: "\\cap" },
                { text: "∪", latex: "\\cup" },
                { text: "∅", latex: "\\emptyset" },
                { text: "⌀", latex: "\\varnothing" },
                { text: "⊥", latex: "\\perp" },
                { text: "∥", latex: "\\parallel" },
                { text: "∦", latex: "\\nparallel" },
                { text: "≍", latex: "\\asymp" }
            ]
        },
        {
            title: "箭头符号",
            collapsed: true,
            layout: "grid",
            items: [
                { text: "→", latex: "\\rightarrow" },
                { text: "←", latex: "\\leftarrow" },
                { text: "↔", latex: "\\leftrightarrow" },
                { text: "⇒", latex: "\\Rightarrow" },
                { text: "⇐", latex: "\\Leftarrow" },
                { text: "⇔", latex: "\\Leftrightarrow" },
                { text: "↑", latex: "\\uparrow" },
                { text: "↓", latex: "\\downarrow" },
                { text: "↕", latex: "\\updownarrow" },
                { text: "⇑", latex: "\\Uparrow" },
                { text: "⇓", latex: "\\Downarrow" },
                { text: "⇕", latex: "\\Updownarrow" },
                { text: "↦", latex: "\\mapsto" },
                { text: "⟶", latex: "\\longrightarrow" },
                { text: "⟵", latex: "\\longleftarrow" },
                { text: "⟷", latex: "\\longleftrightarrow" },
                { text: "↩", latex: "\\hookleftarrow" },
                { text: "↪", latex: "\\hookrightarrow" },
                { text: "⇀", latex: "\\rightharpoonup" },
                { text: "↼", latex: "\\leftharpoonup" }
            ]
        },
        {
            title: "数学字体",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "黑板粗体 ℝ", latex: "\\mathbb{}" },
                { text: "花体 𝓛", latex: "\\mathcal{}" },
                { text: "粗体 𝐀", latex: "\\mathbf{}" },
                { text: "斜体", latex: "\\mathit{}" },
                { text: "罗马体", latex: "\\mathrm{}" },
                { text: "无衬线体", latex: "\\mathsf{}" },
                { text: "打字机体", latex: "\\mathtt{}" },
                { text: "粗体符号", latex: "\\boldsymbol{}" }
            ]
        },
        {
            title: "逻辑符号",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "逻辑与 ∧", latex: "P \\land Q" },
                { text: "逻辑或 ∨", latex: "P \\lor Q" },
                { text: "逻辑非 ¬", latex: "\\neg P" },
                { text: "蕴含 ⟹", latex: "P \\implies Q" },
                { text: "等价 ⟺", latex: "P \\iff Q" },
                { text: "全称量词 ∀", latex: "\\forall x \\in A" },
                { text: "存在量词 ∃", latex: "\\exists x \\in A" },
                { text: "唯一存在 ∃!", latex: "\\exists! x" },
                { text: "不存在 ∄", latex: "\\nexists x" },
                { text: "所以 ∴", latex: "\\therefore" },
                { text: "因为 ∵", latex: "\\because" },
                { text: "证明 ⊢", latex: "\\Gamma \\vdash \\phi" },
                { text: "语义蕴含 ⊨", latex: "\\Gamma \\models \\phi" },
                { text: "定义为 :=", latex: ":=" },
                { text: "定义为 ≜", latex: "\\triangleq" },
                { text: "当且仅当 iff", latex: "\\text{iff}" },
                { text: "使得 s.t.", latex: "\\text{s.t.}" },
                { text: "异或 ⊕", latex: "P \\oplus Q" },
                { text: "真值 T/F", latex: "\\top / \\bot" }
            ]
        },
        {
            title: "点与省略号",
            collapsed: true,
            layout: "grid",
            items: [
                { text: "·", latex: "\\cdot" },
                { text: "⋯", latex: "\\cdots" },
                { text: "…", latex: "\\ldots" },
                { text: "⋮", latex: "\\vdots" },
                { text: "⋱", latex: "\\ddots" },
                { text: "…", latex: "\\dots" }
            ]
        },
        {
            title: "特殊字母",
            collapsed: true,
            layout: "grid",
            items: [
                { text: "ℓ", latex: "\\ell" },
                { text: "ℏ", latex: "\\hbar" },
                { text: "ı", latex: "\\imath" },
                { text: "ȷ", latex: "\\jmath" },
                { text: "℘", latex: "\\wp" },
                { text: "ℵ", latex: "\\aleph" },
                { text: "ℶ", latex: "\\beth" },
                { text: "ℷ", latex: "\\gimel" },
                { text: "ℸ", latex: "\\daleth" },
                { text: "ℑ", latex: "\\Im" },
                { text: "ℜ", latex: "\\Re" },
                { text: "∂", latex: "\\partial" }
            ]
        },
        {
            title: "空格与间距",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "空格 quad", latex: "\\quad" },
                { text: "双空格 qquad", latex: "\\qquad" },
                { text: "小空格 \\,", latex: "\\," },
                { text: "中空格 \\;", latex: "\\;" },
                { text: "负空格 \\!", latex: "\\!" }
            ]
        }
    ],
    right: [
        {
            title: "分数与根式",
            collapsed: false,
            layout: "vertical",
            items: [
                { text: "分数 a/b", latex: "\\frac{a}{b}" },
                { text: "分数 (空模板)", latex: "\\frac{}{}" },
                { text: "大分数 (显示模式)", latex: "\\dfrac{}{}" },
                { text: "小分数 (行内模式)", latex: "\\tfrac{}{}" },
                { text: "连分数", latex: "\\cfrac{1}{1 + \\cfrac{1}{1 + \\cfrac{1}{1}}}" },
                { text: "根号 √x", latex: "\\sqrt{x}" },
                { text: "根号 (空模板)", latex: "\\sqrt{}" },
                { text: "n次根 ⁿ√x", latex: "\\sqrt[n]{x}" },
                { text: "n次根 (空模板)", latex: "\\sqrt[]{}" },
                { text: "二次公式", latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" }
            ]
        },
        {
            title: "上下标",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "上标 x²", latex: "x^{2}" },
                { text: "上标 (空模板)", latex: "^{}" },
                { text: "下标 xᵢ", latex: "x_{i}" },
                { text: "下标 (空模板)", latex: "_{}" },
                { text: "上下标 xᵢⁿ", latex: "x_{i}^{n}" },
                { text: "上下标 (空模板)", latex: "_{}^{}" },
                { text: "左上标 ⁿCᵣ", latex: "{}^{n}C_{r}" },
                { text: "张量上下标", latex: "T^{\\mu\\nu}_{\\alpha\\beta}" },
                { text: "上方标注 (示例)", latex: "\\overset{def}{=}" },
                { text: "上方标注 (空模板)", latex: "\\overset{}{}" },
                { text: "下方标注 (示例)", latex: "\\underset{x \\in A}{\\max}" },
                { text: "下方标注 (空模板)", latex: "\\underset{}{}" },
                { text: "上下堆叠", latex: "\\stackrel{?}{=}" }
            ]
        },
        {
            title: "积分与求和",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "不定积分 ∫ f(x)dx", latex: "\\int f(x) \\, dx" },
                { text: "定积分 ∫ₐᵇ", latex: "\\int_{a}^{b} f(x) \\, dx" },
                { text: "定积分 (空模板)", latex: "\\int_{}^{} \\, d" },
                { text: "二重积分 ∬", latex: "\\iint_{D} f(x,y) \\, dA" },
                { text: "三重积分 ∭", latex: "\\iiint_{V} f(x,y,z) \\, dV" },
                { text: "环路积分 ∮", latex: "\\oint_{C} \\mathbf{F} \\cdot d\\mathbf{r}" },
                { text: "曲面积分 ∯", latex: "\\oiint_{S} \\mathbf{F} \\cdot d\\mathbf{S}" },
                { text: "求和 Σ", latex: "\\sum_{i=1}^{n} a_i" },
                { text: "求和 (空模板)", latex: "\\sum_{}^{}" },
                { text: "连乘 ∏", latex: "\\prod_{i=1}^{n} a_i" },
                { text: "极限 lim", latex: "\\lim_{x \\to \\infty} f(x)" },
                { text: "极限 (空模板)", latex: "\\lim_{} " },
                { text: "右极限 x→a⁺", latex: "\\lim_{x \\to a^+} f(x)" },
                { text: "左极限 x→a⁻", latex: "\\lim_{x \\to a^-} f(x)" },
                { text: "上极限 limsup", latex: "\\limsup_{n \\to \\infty} a_n" },
                { text: "下极限 liminf", latex: "\\liminf_{n \\to \\infty} a_n" },
                { text: "上确界 sup", latex: "\\sup_{x \\in A} f(x)" },
                { text: "下确界 inf", latex: "\\inf_{x \\in A} f(x)" },
                { text: "最大值 max", latex: "\\max_{x} f(x)" },
                { text: "最小值 min", latex: "\\min_{x} f(x)" },
                { text: "argmax", latex: "\\arg\\max_{x} f(x)" },
                { text: "argmin", latex: "\\arg\\min_{x} f(x)" }
            ]
        },
        {
            title: "导数与微分",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "导数 dy/dx", latex: "\\frac{dy}{dx}" },
                { text: "导数 df/dx", latex: "\\frac{df}{dx}" },
                { text: "导数 (空模板)", latex: "\\frac{d}{d}" },
                { text: "二阶导数 d²y/dx²", latex: "\\frac{d^2 y}{dx^2}" },
                { text: "n阶导数", latex: "\\frac{d^n y}{dx^n}" },
                { text: "偏导 ∂f/∂x", latex: "\\frac{\\partial f}{\\partial x}" },
                { text: "偏导 (空模板)", latex: "\\frac{\\partial }{\\partial }" },
                { text: "二阶偏导 ∂²f/∂x²", latex: "\\frac{\\partial^2 f}{\\partial x^2}" },
                { text: "混合偏导 ∂²f/∂x∂y", latex: "\\frac{\\partial^2 f}{\\partial x \\partial y}" },
                { text: "梯度 ∇f", latex: "\\nabla f" },
                { text: "散度 ∇·F", latex: "\\nabla \\cdot \\mathbf{F}" },
                { text: "旋度 ∇×F", latex: "\\nabla \\times \\mathbf{F}" },
                { text: "拉普拉斯 ∇²f", latex: "\\nabla^2 f" },
                { text: "微分 dx", latex: "\\mathrm{d}x" },
                { text: "全微分 df", latex: "df = \\frac{\\partial f}{\\partial x} dx + \\frac{\\partial f}{\\partial y} dy" },
                { text: "导数简写 f'(x)", latex: "f'(x)" },
                { text: "导数简写 f''(x)", latex: "f''(x)" }
            ]
        },
        {
            title: "矩阵",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "无括号 2×2", latex: "\\begin{matrix} a & b \\\\ c & d \\end{matrix}" },
                { text: "圆括号 ( ) 2×2", latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
                { text: "方括号 [ ] 2×2", latex: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}" },
                { text: "花括号 { } 2×2", latex: "\\begin{Bmatrix} a & b \\\\ c & d \\end{Bmatrix}" },
                { text: "行列式 | | 2×2", latex: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}" },
                { text: "范数 ‖ ‖ 2×2", latex: "\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}" },
                { text: "3×3 方括号矩阵", latex: "\\begin{bmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{bmatrix}" },
                { text: "列向量", latex: "\\begin{bmatrix} x_1 \\\\ x_2 \\\\ \\vdots \\\\ x_n \\end{bmatrix}" },
                { text: "行向量", latex: "\\begin{bmatrix} x_1 & x_2 & \\cdots & x_n \\end{bmatrix}" },
                { text: "对角矩阵", latex: "\\begin{bmatrix} a_1 & & \\\\ & \\ddots & \\\\ & & a_n \\end{bmatrix}" },
                { text: "分块矩阵", latex: "\\begin{bmatrix} \\mathbf{A} & \\mathbf{B} \\\\ \\mathbf{C} & \\mathbf{D} \\end{bmatrix}" }
            ]
        },
        {
            title: "括号",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "自适应圆括号 ()", latex: "\\left( \\right)" },
                { text: "自适应方括号 []", latex: "\\left[ \\right]" },
                { text: "自适应花括号 {}", latex: "\\left\\{ \\right\\}" },
                { text: "自适应绝对值 |x|", latex: "\\left| x \\right|" },
                { text: "自适应范数 ‖x‖", latex: "\\left\\| \\mathbf{x} \\right\\|" },
                { text: "尖括号 ⟨x,y⟩", latex: "\\left\\langle x, y \\right\\rangle" },
                { text: "下取整 ⌊x⌋", latex: "\\left\\lfloor x \\right\\rfloor" },
                { text: "上取整 ⌈x⌉", latex: "\\left\\lceil x \\right\\rceil" },
                { text: "组合数 C(n,k)", latex: "\\binom{n}{k}" },
                { text: "组合数 (空模板)", latex: "\\binom{}{}" },
                { text: "大组合数", latex: "\\dbinom{n}{k}" },
                { text: "Pochhammer符号", latex: "(x)_n" },
                { text: "单边括号 (左)", latex: "\\left. \\frac{df}{dx} \\right|_{x=a}" },
                { text: "条件集合", latex: "\\left\\{ x \\in A \\mid P(x) \\right\\}" }
            ]
        },
        {
            title: "多行公式",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "块级公式 $$...$$", latex: "$$\n\n$$" },
                { text: "行内公式 $...$", latex: "$  $" },
                { text: "对齐 align", latex: "$$\n\\begin{align}\n  &=  \\\\\n  &= \n\\end{align}\n$$" },
                { text: "对齐 aligned", latex: "$$\n\\begin{aligned}\n  &=  \\\\\n  &= \n\\end{aligned}\n$$" },
                { text: "分段函数 cases", latex: "$$\n\\begin{cases}\n  , & \\text{if } \\\\\n  , & \\text{otherwise}\n\\end{cases}\n$$" },
                { text: "编号公式 equation", latex: "$$\n\\begin{equation}\n\n\\end{equation}\n$$" },
                { text: "gather (居中多行)", latex: "$$\n\\begin{gather}\n  \\\\\n  \n\\end{gather}\n$$" }
            ]
        },
        {
            title: "标注与装饰",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "帽子 x̂", latex: "\\hat{x}" },
                { text: "帽子 (空模板)", latex: "\\hat{}" },
                { text: "宽帽子 θ̂", latex: "\\widehat{\\theta}" },
                { text: "横线 x̄ (均值)", latex: "\\bar{x}" },
                { text: "上划线 (长)", latex: "\\overline{AB}" },
                { text: "下划线", latex: "\\underline{text}" },
                { text: "波浪 x̃", latex: "\\tilde{x}" },
                { text: "宽波浪", latex: "\\widetilde{ABC}" },
                { text: "向量箭头 v⃗", latex: "\\vec{v}" },
                { text: "粗体向量", latex: "\\mathbf{v}" },
                { text: "时间导数 ẋ", latex: "\\dot{x}" },
                { text: "二阶时间导数 ẍ", latex: "\\ddot{x}" },
                { text: "三阶时间导数", latex: "\\dddot{x}" },
                { text: "上括号 (带标注)", latex: "\\overbrace{a + b + c}^{\\text{sum}}" },
                { text: "下括号 (带标注)", latex: "\\underbrace{x + y + z}_{n \\text{ terms}}" },
                { text: "上下箭头", latex: "\\xleftarrow{} \\xrightarrow{}" },
                { text: "删除线 (取消)", latex: "\\cancel{x}" },
                { text: "反删除线", latex: "\\bcancel{x}" },
                { text: "交叉删除", latex: "\\xcancel{x}" },
                { text: "尖括号装饰", latex: "\\acute{a}" },
                { text: "重音符装饰", latex: "\\grave{a}" },
                { text: "勾号装饰", latex: "\\check{a}" }
            ]
        },
        {
            title: "常用数集",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "实数集 ℝ", latex: "\\mathbb{R}" },
                { text: "正实数 ℝ⁺", latex: "\\mathbb{R}^{+}" },
                { text: "非负实数 ℝ≥0", latex: "\\mathbb{R}_{\\geq 0}" },
                { text: "n维实空间 ℝⁿ", latex: "\\mathbb{R}^{n}" },
                { text: "复数集 ℂ", latex: "\\mathbb{C}" },
                { text: "整数集 ℤ", latex: "\\mathbb{Z}" },
                { text: "正整数 ℤ⁺", latex: "\\mathbb{Z}^{+}" },
                { text: "非负整数", latex: "\\mathbb{Z}_{\\geq 0}" },
                { text: "有理数集 ℚ", latex: "\\mathbb{Q}" },
                { text: "自然数集 ℕ", latex: "\\mathbb{N}" },
                { text: "素数集 ℙ", latex: "\\mathbb{P}" },
                { text: "四元数 ℍ", latex: "\\mathbb{H}" },
                { text: "域 𝔽", latex: "\\mathbb{F}" },
                { text: "区间 [a,b]", latex: "[a, b]" },
                { text: "开区间 (a,b)", latex: "(a, b)" },
                { text: "半开区间 [a,b)", latex: "[a, b)" },
                { text: "单位区间 [0,1]", latex: "[0, 1]" },
                { text: "属于 x∈A", latex: "x \\in A" },
                { text: "子集 A⊂B", latex: "A \\subset B" },
                { text: "真子集 A⊊B", latex: "A \\subsetneq B" },
                { text: "集合差 A\\B", latex: "A \\setminus B" },
                { text: "补集 Aᶜ", latex: "A^{c}" }
            ]
        },
        {
            title: "概率统计",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "期望 𝔼[X]", latex: "\\mathbb{E}[X]" },
                { text: "条件期望 𝔼[X|Y]", latex: "\\mathbb{E}[X | Y]" },
                { text: "概率 ℙ(A)", latex: "\\mathbb{P}(A)" },
                { text: "条件概率 P(A|B)", latex: "P(A | B) = \\frac{P(A \\cap B)}{P(B)}" },
                { text: "贝叶斯公式", latex: "P(A|B) = \\frac{P(B|A)P(A)}{P(B)}" },
                { text: "全概率公式", latex: "P(A) = \\sum_i P(A|B_i)P(B_i)" },
                { text: "方差 Var(X)", latex: "\\mathrm{Var}(X) = \\mathbb{E}[X^2] - (\\mathbb{E}[X])^2" },
                { text: "协方差 Cov(X,Y)", latex: "\\mathrm{Cov}(X, Y) = \\mathbb{E}[XY] - \\mathbb{E}[X]\\mathbb{E}[Y]" },
                { text: "相关系数 ρ", latex: "\\rho_{X,Y} = \\frac{\\mathrm{Cov}(X,Y)}{\\sigma_X \\sigma_Y}" },
                { text: "标准差 σ", latex: "\\sigma = \\sqrt{\\mathrm{Var}(X)}" },
                { text: "服从分布 X~", latex: "X \\sim" },
                { text: "正态分布 𝒩(μ,σ²)", latex: "X \\sim \\mathcal{N}(\\mu, \\sigma^2)" },
                { text: "标准正态 𝒩(0,1)", latex: "Z \\sim \\mathcal{N}(0, 1)" },
                { text: "多元正态", latex: "\\mathbf{X} \\sim \\mathcal{N}(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})" },
                { text: "均匀分布 U(a,b)", latex: "X \\sim \\mathcal{U}(a, b)" },
                { text: "指数分布", latex: "X \\sim \\text{Exp}(\\lambda)" },
                { text: "伯努利分布", latex: "X \\sim \\text{Bernoulli}(p)" },
                { text: "二项分布", latex: "X \\sim \\text{Binomial}(n, p)" },
                { text: "泊松分布", latex: "X \\sim \\text{Poisson}(\\lambda)" },
                { text: "似然函数", latex: "\\mathcal{L}(\\theta; \\mathbf{x}) = \\prod_{i=1}^{n} p(x_i | \\theta)" },
                { text: "对数似然", latex: "\\ell(\\theta) = \\sum_{i=1}^{n} \\log p(x_i | \\theta)" },
                { text: "后验 ∝ 似然×先验", latex: "p(\\theta | \\mathbf{x}) \\propto p(\\mathbf{x} | \\theta) p(\\theta)" },
                { text: "MLE估计", latex: "\\hat{\\theta}_{\\text{MLE}} = \\arg\\max_{\\theta} \\mathcal{L}(\\theta; \\mathbf{x})" },
                { text: "MAP估计", latex: "\\hat{\\theta}_{\\text{MAP}} = \\arg\\max_{\\theta} p(\\theta | \\mathbf{x})" }
            ]
        },
        {
            title: "三角函数",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "sin(x)", latex: "\\sin(x)" },
                { text: "cos(x)", latex: "\\cos(x)" },
                { text: "tan(x)", latex: "\\tan(x)" },
                { text: "cot(x)", latex: "\\cot(x)" },
                { text: "sec(x)", latex: "\\sec(x)" },
                { text: "csc(x)", latex: "\\csc(x)" },
                { text: "sin²(x)", latex: "\\sin^2(x)" },
                { text: "cos²(x)", latex: "\\cos^2(x)" },
                { text: "arcsin(x)", latex: "\\arcsin(x)" },
                { text: "arccos(x)", latex: "\\arccos(x)" },
                { text: "arctan(x)", latex: "\\arctan(x)" },
                { text: "sinh(x)", latex: "\\sinh(x)" },
                { text: "cosh(x)", latex: "\\cosh(x)" },
                { text: "tanh(x)", latex: "\\tanh(x)" },
                { text: "恒等式 sin²+cos²", latex: "\\sin^2(x) + \\cos^2(x) = 1" },
                { text: "欧拉公式", latex: "e^{i\\theta} = \\cos\\theta + i\\sin\\theta" },
                { text: "对数 ln(x)", latex: "\\ln(x)" },
                { text: "对数 log(x)", latex: "\\log(x)" },
                { text: "对数 log_a(x)", latex: "\\log_{a}(x)" },
                { text: "指数 exp(x)", latex: "\\exp(x)" },
                { text: "指数 e^x", latex: "e^{x}" }
            ]
        },
        {
            title: "机器学习",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "损失函数 𝓛", latex: "\\mathcal{L}(\\theta)" },
                { text: "数据集 𝓓", latex: "\\mathcal{D} = \\{(x_i, y_i)\\}_{i=1}^{N}" },
                { text: "假设空间 𝓗", latex: "\\mathcal{H}" },
                { text: "参数 θ", latex: "\\theta" },
                { text: "最优参数 θ*", latex: "\\theta^* = \\arg\\min_{\\theta} \\mathcal{L}(\\theta)" },
                { text: "梯度 ∇θL", latex: "\\nabla_{\\theta} \\mathcal{L}" },
                { text: "预测值 ŷ", latex: "\\hat{y}" },
                { text: "真实值 y", latex: "y" },
                { text: "输入向量 𝐱", latex: "\\mathbf{x} \\in \\mathbb{R}^d" },
                { text: "权重矩阵 𝐖", latex: "\\mathbf{W} \\in \\mathbb{R}^{m \\times n}" },
                { text: "偏置向量 𝐛", latex: "\\mathbf{b} \\in \\mathbb{R}^m" },
                { text: "隐藏层 𝐡", latex: "\\mathbf{h} = \\sigma(\\mathbf{W}\\mathbf{x} + \\mathbf{b})" },
                { text: "概率输出", latex: "p(y | \\mathbf{x}; \\theta)" }
            ]
        },
        {
            title: "Markdown格式",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "二级标题 ##", latex: "## " },
                { text: "三级标题 ###", latex: "### " },
                { text: "粗体 **text**", latex: "**  **" },
                { text: "斜体 *text*", latex: "*  *" },
                { text: "粗斜体 ***text***", latex: "***  ***" },
                { text: "行内代码 `code`", latex: "`  `" },
                { text: "代码块 ```", latex: "```\n\n```" },
                { text: "无序列表 -", latex: "- " },
                { text: "有序列表 1.", latex: "1. " },
                { text: "链接 [text](url)", latex: "[]()" },
                { text: "图片 ![alt](url)", latex: "![]()" },
                { text: "引用 >", latex: "> " },
                { text: "分隔线 ---", latex: "\n---\n" },
                { text: "表格", latex: "| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |" }
            ]
        },
        {
            title: "深度学习",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "softmax 公式", latex: "\\text{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_{j} e^{z_j}}" },
                { text: "ReLU 公式", latex: "\\text{ReLU}(x) = \\max(0, x)" },
                { text: "Leaky ReLU", latex: "\\text{LeakyReLU}(x) = \\max(\\alpha x, x)" },
                { text: "GELU", latex: "\\text{GELU}(x) = x \\cdot \\Phi(x)" },
                { text: "sigmoid 公式", latex: "\\sigma(x) = \\frac{1}{1+e^{-x}}" },
                { text: "tanh 公式", latex: "\\tanh(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}" },
                { text: "Attention 公式", latex: "\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V" },
                { text: "Self-Attention", latex: "\\text{MultiHead}(Q,K,V) = \\text{Concat}(head_1, ..., head_h)W^O" },
                { text: "线性层", latex: "\\mathbf{y} = \\mathbf{W} \\mathbf{x} + \\mathbf{b}" },
                { text: "BatchNorm", latex: "\\hat{x} = \\frac{x - \\mu}{\\sqrt{\\sigma^2 + \\epsilon}}" },
                { text: "LayerNorm", latex: "\\text{LayerNorm}(x) = \\gamma \\cdot \\frac{x - \\mu}{\\sigma} + \\beta" },
                { text: "Dropout", latex: "\\text{Dropout}(x, p)" },
                { text: "残差连接", latex: "\\mathbf{y} = \\mathcal{F}(\\mathbf{x}) + \\mathbf{x}" }
            ]
        },
        {
            title: "常见损失函数",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "MSE (均方误差)", latex: "\\mathcal{L}_{\\text{MSE}} = \\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2" },
                { text: "MAE (平均绝对误差)", latex: "\\mathcal{L}_{\\text{MAE}} = \\frac{1}{n} \\sum_{i=1}^n |y_i - \\hat{y}_i|" },
                { text: "二元交叉熵 BCE", latex: "\\mathcal{L}_{\\text{BCE}} = -[y \\log(\\hat{y}) + (1-y)\\log(1-\\hat{y})]" },
                { text: "多类交叉熵 CE", latex: "\\mathcal{L}_{\\text{CE}} = -\\sum_{c=1}^{C} y_c \\log(\\hat{y}_c)" },
                { text: "KL 散度", latex: "D_{\\text{KL}}(P || Q) = \\sum_i P(i) \\log \\frac{P(i)}{Q(i)}" },
                { text: "Hinge Loss", latex: "\\mathcal{L}_{\\text{hinge}} = \\max(0, 1 - y \\cdot \\hat{y})" },
                { text: "Focal Loss", latex: "\\mathcal{L}_{\\text{focal}} = -\\alpha (1-\\hat{y})^\\gamma \\log(\\hat{y})" },
                { text: "Dice Loss", latex: "\\mathcal{L}_{\\text{Dice}} = 1 - \\frac{2|X \\cap Y|}{|X| + |Y|}" },
                { text: "L1 正则化", latex: "\\Omega(\\mathbf{w}) = \\lambda \\|\\mathbf{w}\\|_1" },
                { text: "L2 正则化", latex: "\\Omega(\\mathbf{w}) = \\frac{\\lambda}{2} \\|\\mathbf{w}\\|_2^2" },
                { text: "对比损失 Contrastive", latex: "\\mathcal{L} = (1-y) \\frac{1}{2} d^2 + y \\frac{1}{2} \\max(0, m-d)^2" }
            ]
        },
        {
            title: "线性代数",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "转置 Aᵀ", latex: "\\mathbf{A}^{\\top}" },
                { text: "共轭转置 A†", latex: "\\mathbf{A}^{\\dagger}" },
                { text: "逆矩阵 A⁻¹", latex: "\\mathbf{A}^{-1}" },
                { text: "伪逆 A⁺", latex: "\\mathbf{A}^{+}" },
                { text: "行列式 det(A)", latex: "\\det(\\mathbf{A})" },
                { text: "行列式 |A|", latex: "|\\mathbf{A}|" },
                { text: "迹 tr(A)", latex: "\\text{tr}(\\mathbf{A})" },
                { text: "秩 rank(A)", latex: "\\text{rank}(\\mathbf{A})" },
                { text: "核/零空间", latex: "\\ker(\\mathbf{A})" },
                { text: "像/列空间", latex: "\\text{Im}(\\mathbf{A})" },
                { text: "2-范数 ‖x‖₂", latex: "\\|\\mathbf{x}\\|_2" },
                { text: "1-范数 ‖x‖₁", latex: "\\|\\mathbf{x}\\|_1" },
                { text: "∞-范数 ‖x‖∞", latex: "\\|\\mathbf{x}\\|_\\infty" },
                { text: "Frobenius范数", latex: "\\|\\mathbf{A}\\|_F" },
                { text: "谱范数", latex: "\\|\\mathbf{A}\\|_2" },
                { text: "内积 ⟨x,y⟩", latex: "\\langle \\mathbf{x}, \\mathbf{y} \\rangle" },
                { text: "点积 x·y", latex: "\\mathbf{x} \\cdot \\mathbf{y}" },
                { text: "叉积 x×y", latex: "\\mathbf{x} \\times \\mathbf{y}" },
                { text: "外积 xyᵀ", latex: "\\mathbf{x} \\mathbf{y}^{\\top}" },
                { text: "克罗内克积 ⊗", latex: "\\mathbf{A} \\otimes \\mathbf{B}" },
                { text: "Hadamard积 ⊙", latex: "\\mathbf{A} \\odot \\mathbf{B}" },
                { text: "特征分解", latex: "\\mathbf{A} = \\mathbf{V} \\mathbf{\\Lambda} \\mathbf{V}^{-1}" },
                { text: "SVD分解", latex: "\\mathbf{A} = \\mathbf{U} \\mathbf{\\Sigma} \\mathbf{V}^{\\top}" },
                { text: "特征值方程", latex: "\\mathbf{A}\\mathbf{v} = \\lambda \\mathbf{v}" },
                { text: "正定矩阵", latex: "\\mathbf{A} \\succ 0" },
                { text: "半正定矩阵", latex: "\\mathbf{A} \\succeq 0" }
            ]
        },
        {
            title: "优化算法",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "梯度下降", latex: "\\theta_{t+1} = \\theta_t - \\eta \\nabla_{\\theta} \\mathcal{L}" },
                { text: "SGD + 动量", latex: "v_t = \\gamma v_{t-1} + \\eta \\nabla_{\\theta} \\mathcal{L}" },
                { text: "Adam 更新", latex: "\\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t" },
                { text: "学习率衰减", latex: "\\eta_t = \\eta_0 \\cdot \\gamma^{\\lfloor t/s \\rfloor}" },
                { text: "余弦退火", latex: "\\eta_t = \\eta_{\\min} + \\frac{1}{2}(\\eta_{\\max} - \\eta_{\\min})(1 + \\cos(\\frac{t}{T}\\pi))" },
                { text: "权重衰减", latex: "\\theta_{t+1} = (1 - \\lambda)\\theta_t - \\eta \\nabla_{\\theta} \\mathcal{L}" }
            ]
        },
        {
            title: "常数与特殊函数",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "圆周率 π", latex: "\\pi" },
                { text: "自然常数 e", latex: "e" },
                { text: "虚数单位 i", latex: "i" },
                { text: "黄金比例 φ", latex: "\\varphi" },
                { text: "欧拉常数 γ", latex: "\\gamma" },
                { text: "无穷大 ∞", latex: "\\infty" },
                { text: "正无穷 +∞", latex: "+\\infty" },
                { text: "负无穷 -∞", latex: "-\\infty" },
                { text: "Gamma函数 Γ(x)", latex: "\\Gamma(x)" },
                { text: "Beta函数 B(a,b)", latex: "B(a, b)" },
                { text: "阶乘 n!", latex: "n!" },
                { text: "双阶乘 n!!", latex: "n!!" },
                { text: "Dirac δ函数", latex: "\\delta(x)" },
                { text: "Heaviside函数", latex: "H(x)" },
                { text: "符号函数 sgn", latex: "\\text{sgn}(x)" },
                { text: "指示函数 𝟙", latex: "\\mathbb{1}_{A}(x)" },
                { text: "取整函数 ⌊x⌋", latex: "\\lfloor x \\rfloor" },
                { text: "取整函数 ⌈x⌉", latex: "\\lceil x \\rceil" },
                { text: "模运算 mod", latex: "a \\mod n" },
                { text: "最大公约数", latex: "\\gcd(a, b)" },
                { text: "最小公倍数", latex: "\\text{lcm}(a, b)" }
            ]
        },
        {
            title: "颜色与高亮",
            collapsed: true,
            layout: "vertical",
            items: [
                { text: "红色文本", latex: "\\textcolor{red}{  }" },
                { text: "蓝色文本", latex: "\\textcolor{blue}{  }" },
                { text: "绿色文本", latex: "\\textcolor{green}{  }" },
                { text: "橙色文本", latex: "\\textcolor{orange}{  }" },
                { text: "紫色文本", latex: "\\textcolor{purple}{  }" },
                { text: "黄色背景", latex: "\\bbox[yellow]{  }" },
                { text: "浅蓝背景", latex: "\\bbox[#e0f0ff]{  }" },
                { text: "方框", latex: "\\boxed{  }" },
                { text: "圆角方框", latex: "\\bbox[5px, border: 2px solid]{  }" }
            ]
        }
    ]
};

/**
 * Escape LaTeX string for use in onclick attribute
 * @param {string} latex - LaTeX string to escape
 * @returns {string} Escaped string safe for onclick
 */
function escapeForOnclick(latex) {
    return latex
        .replace(/\\/g, '\\\\')  // Escape backslashes first
        .replace(/'/g, "\\'")     // Escape single quotes
        .replace(/\n/g, '\\n');   // Escape newlines
}

/**
 * Generate toolbar HTML from data
 * @param {string} side - 'left' or 'right'
 * @returns {string} HTML string
 */
function generateToolbarHTML(side) {
    const sections = TOOLBAR_DATA[side];
    
    return sections.map(section => {
        const contentClass = section.collapsed ? 'toolbar-content collapsed' : 'toolbar-content';
        const labelClass = section.collapsed ? 'toolbar-label collapsed' : 'toolbar-label';
        const buttonsClass = section.layout === 'vertical' ? 'toolbar-buttons-vertical' : 'toolbar-buttons';
        const btnClass = section.layout === 'vertical' ? 'tool-btn-large' : 'tool-btn';
        
        const buttons = section.items.map(item => 
            `<button class="${btnClass}" onclick="insertText('${escapeForOnclick(item.latex)}')" title="${item.latex.replace(/"/g, '&quot;')}">${item.text}</button>`
        ).join('\n');
        
        return `
            <div class="toolbar-section">
                <div class="${labelClass}" onclick="toggleSection(this)">${section.title}</div>
                <div class="${contentClass}">
                    <div class="${buttonsClass}">
                        ${buttons}
                    </div>
                </div>
            </div>
        `;
    }).join('\n');
}

// Export
window.PaperNotes = window.PaperNotes || {};
window.PaperNotes.TOOLBAR_DATA = TOOLBAR_DATA;
window.PaperNotes.generateToolbarHTML = generateToolbarHTML;
