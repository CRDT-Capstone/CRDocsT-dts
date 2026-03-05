export const LATEX_DOC_FIXTURES = {
    // Baseline minimal document
    MINIMAL_BASE: `\\section{Introduction}\nThis is a simple document.`,

    // Exact duplicate to test identical structure mapping
    MINIMAL_UNCHANGED: `\\section{Introduction}\nThis is a simple document.`,

    // Additions that should leave the base mapped, and append unmapped nodes
    MINIMAL_APPENDED: `\\section{Introduction}\nThis is a simple document.\n\\section{Methods}\nAdded new section.`,

    // Textual modifications that alter metrics and hash-based mappers
    MINIMAL_MODIFIED: `\\section{Intro}\nThis is an updated document.`,

    // Boundary input: Empty
    EMPTY: ``,

    // Complex documents for reordering and deep structure tests
    COMPLEX_BASE: `
        \\begin{document}
        \\section{Abstract}
        Here is the abstract.
        \\section{Body}
        Here is the body.
        \\end{document}
    `,

    // Same blocks, different positions, to test mapping preservation across shifts
    COMPLEX_REORDERED: `
        \\begin{document}
        \\section{Body}
        Here is the body.
        \\section{Abstract}
        Here is the abstract.
        \\end{document}
    `,
};
