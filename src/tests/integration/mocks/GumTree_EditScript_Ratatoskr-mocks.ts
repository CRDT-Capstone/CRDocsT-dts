export const RATATOSKR_FIXTURES = {
    // Baseline minimal document
    BASE: `\\section{Introduction}\nThis is the starting document.`,

    // Additions (Generates TreeInsert)
    APPENDED: `\\section{Introduction}\nThis is the starting document.\n\\section{Methods}\nNew content added here.`,

    // Deletions (Generates TreeDelete)
    DELETED: `\\section{Introduction}`,

    // Textual modifications (Generates Update)
    UPDATED: `\\section{Intro}\nThis is the starting document.`,

    // Structural changes (Generates Move)
    REORDERED: `This is the starting document.\n\\section{Introduction}`,
};
