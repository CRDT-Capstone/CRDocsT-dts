// Auto-generated from node-types.json

import { Node } from "web-tree-sitter";
import { v4 } from "uuid";

export type NodeId = string;

export interface ParserContext {
    nodes: Map<NodeId, AstNode>;
}

// Interfaces

export interface AcronymDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "acronym_definition";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    long: NodeId;
    name: NodeId;
    options?: NodeId;
    short: NodeId;
    childrenIds: NodeId[];
}

export interface AcronymReferenceNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "acronym_reference";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    name: NodeId;
    options?: NodeId;
    childrenIds: NodeId[];
}

export interface AsyEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "asy_environment";
    text: string;
    startIndex: number;
    endIndex: number;
    begin: NodeId;
    code: NodeId;
    end: NodeId;
    childrenIds: NodeId[];
}

export interface AsydefEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "asydef_environment";
    text: string;
    startIndex: number;
    endIndex: number;
    begin: NodeId;
    code: NodeId;
    end: NodeId;
    childrenIds: NodeId[];
}

export interface AuthorNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "author";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface AuthorDeclarationNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "author_declaration";
    text: string;
    startIndex: number;
    endIndex: number;
    authors: NodeId;
    command: NodeId;
    options?: NodeId;
    childrenIds: NodeId[];
}

export interface BeginNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "begin";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    language?: NodeId;
    name: NodeId;
    options?: NodeId;
    childrenIds: NodeId[];
}

export interface BiblatexIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "biblatex_include";
    text: string;
    startIndex: number;
    endIndex: number;
    glob: NodeId;
    options?: NodeId;
    childrenIds: NodeId[];
}

export interface BibstyleIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "bibstyle_include";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    path: NodeId;
    childrenIds: NodeId[];
}

export interface BibtexIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "bibtex_include";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    paths: NodeId;
    childrenIds: NodeId[];
}

export interface BlockCommentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "block_comment";
    text: string;
    startIndex: number;
    endIndex: number;
    begin: NodeId;
    comment?: NodeId;
    end?: NodeId;
    childrenIds: NodeId[];
}

export interface BrackGroupNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "brack_group";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface BrackGroupArgcNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "brack_group_argc";
    text: string;
    startIndex: number;
    endIndex: number;
    value: NodeId;
    childrenIds: NodeId[];
}

export interface BrackGroupKeyValueNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "brack_group_key_value";
    text: string;
    startIndex: number;
    endIndex: number;
    pair?: NodeId[];
    childrenIds: NodeId[];
}

export interface BrackGroupTextNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "brack_group_text";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface BrackGroupWordNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "brack_group_word";
    text: string;
    startIndex: number;
    endIndex: number;
    word: NodeId;
    childrenIds: NodeId[];
}

export interface CaptionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "caption";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    long: NodeId;
    short?: NodeId;
    childrenIds: NodeId[];
}

export interface ChangesReplacedNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "changes_replaced";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    text_added: NodeId;
    text_deleted: NodeId;
    childrenIds: NodeId[];
}

export interface ChapterNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "chapter";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    toc?: NodeId;
    childrenIds: NodeId[];
}

export interface CitationNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "citation";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    keys: NodeId;
    postnote?: NodeId;
    prenote?: NodeId;
    childrenIds: NodeId[];
}

export interface ClassIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "class_include";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    options?: NodeId;
    path: NodeId;
    childrenIds: NodeId[];
}

export interface ColorDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "color_definition";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    model: NodeId;
    name: NodeId;
    spec: NodeId;
    childrenIds: NodeId[];
}

export interface ColorReferenceNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "color_reference";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    model?: NodeId;
    name?: NodeId;
    spec?: NodeId;
    childrenIds: NodeId[];
}

export interface ColorSetDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "color_set_definition";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    head: NodeId;
    model: NodeId;
    spec: NodeId;
    tail: NodeId;
    ty?: NodeId;
    childrenIds: NodeId[];
}

export interface CommentEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "comment_environment";
    text: string;
    startIndex: number;
    endIndex: number;
    begin: NodeId;
    comment: NodeId;
    end: NodeId;
    childrenIds: NodeId[];
}

export interface CounterAdditionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "counter_addition";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    counter: NodeId;
    value: NodeId[];
    childrenIds: NodeId[];
}

export interface CounterDeclarationNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "counter_declaration";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    counter: NodeId;
    supercounter?: NodeId;
    childrenIds: NodeId[];
}

export interface CounterDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "counter_definition";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    counter: NodeId;
    value: NodeId[];
    childrenIds: NodeId[];
}

export interface CounterIncrementNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "counter_increment";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    counter: NodeId;
    childrenIds: NodeId[];
}

export interface CounterTypesettingNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "counter_typesetting";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    counter: NodeId;
    childrenIds: NodeId[];
}

export interface CounterValueNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "counter_value";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    counter: NodeId;
    childrenIds: NodeId[];
}

export interface CounterWithinDeclarationNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "counter_within_declaration";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    counter: NodeId;
    supercounter: NodeId;
    childrenIds: NodeId[];
}

export interface CounterWithoutDeclarationNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "counter_without_declaration";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    counter: NodeId;
    supercounter: NodeId;
    childrenIds: NodeId[];
}

export interface CurlyGroupNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface CurlyGroupAuthorListNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_author_list";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface CurlyGroupCommandNameNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_command_name";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    childrenIds: NodeId[];
}

export interface CurlyGroupGlobPatternNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_glob_pattern";
    text: string;
    startIndex: number;
    endIndex: number;
    pattern: NodeId;
    childrenIds: NodeId[];
}

export interface CurlyGroupImplNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_impl";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface CurlyGroupKeyValueNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_key_value";
    text: string;
    startIndex: number;
    endIndex: number;
    pair?: NodeId[];
    childrenIds: NodeId[];
}

export interface CurlyGroupLabelNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_label";
    text: string;
    startIndex: number;
    endIndex: number;
    label: NodeId;
    childrenIds: NodeId[];
}

export interface CurlyGroupLabelListNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_label_list";
    text: string;
    startIndex: number;
    endIndex: number;
    label?: NodeId[];
    childrenIds: NodeId[];
}

export interface CurlyGroupPathNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_path";
    text: string;
    startIndex: number;
    endIndex: number;
    path: NodeId;
    childrenIds: NodeId[];
}

export interface CurlyGroupPathListNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_path_list";
    text: string;
    startIndex: number;
    endIndex: number;
    path?: NodeId[];
    childrenIds: NodeId[];
}

export interface CurlyGroupSpecNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_spec";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface CurlyGroupTextNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_text";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface CurlyGroupTextListNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_text_list";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface CurlyGroupUriNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_uri";
    text: string;
    startIndex: number;
    endIndex: number;
    uri: NodeId;
    childrenIds: NodeId[];
}

export interface CurlyGroupValueNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_value";
    text: string;
    startIndex: number;
    endIndex: number;
    value: NodeId;
    childrenIds: NodeId[];
}

export interface CurlyGroupWordNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_word";
    text: string;
    startIndex: number;
    endIndex: number;
    word: NodeId;
    childrenIds: NodeId[];
}

export interface DisplayedEquationNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "displayed_equation";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface EndNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "end";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    name: NodeId;
    childrenIds: NodeId[];
}

export interface EnumItemNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "enum_item";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    label?: NodeId;
    childrenIds: NodeId[];
}

export interface EnvironmentDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "environment_definition";
    text: string;
    startIndex: number;
    endIndex: number;
    argc?: NodeId;
    begin?: NodeId;
    command: NodeId;
    end?: NodeId;
    name: NodeId[];
    spec?: NodeId;
    childrenIds: NodeId[];
}

export interface GenericCommandNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "generic_command";
    text: string;
    startIndex: number;
    endIndex: number;
    arg?: NodeId[];
    command: NodeId;
    childrenIds: NodeId[];
}

export interface GenericEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "generic_environment";
    text: string;
    startIndex: number;
    endIndex: number;
    begin: NodeId;
    end: NodeId;
    childrenIds: NodeId[];
}

export interface GlobPatternNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "glob_pattern";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface GlossaryEntryDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "glossary_entry_definition";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    name: NodeId;
    options: NodeId;
    childrenIds: NodeId[];
}

export interface GlossaryEntryReferenceNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "glossary_entry_reference";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    name: NodeId;
    options?: NodeId;
    childrenIds: NodeId[];
}

export interface GraphicsIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "graphics_include";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    options?: NodeId;
    path: NodeId;
    childrenIds: NodeId[];
}

export interface HyperlinkNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "hyperlink";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    label?: NodeId;
    uri: NodeId;
    childrenIds: NodeId[];
}

export interface ImportIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "import_include";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    directory: NodeId;
    file: NodeId;
    childrenIds: NodeId[];
}

export interface InkscapeIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "inkscape_include";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    options?: NodeId;
    path: NodeId;
    childrenIds: NodeId[];
}

export interface InlineFormulaNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "inline_formula";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface KeyValuePairNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "key_value_pair";
    text: string;
    startIndex: number;
    endIndex: number;
    key: NodeId;
    value?: NodeId;
    childrenIds: NodeId[];
}

export interface LabelDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "label_definition";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    name: NodeId;
    childrenIds: NodeId[];
}

export interface LabelNumberNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "label_number";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    name: NodeId;
    number: NodeId;
    childrenIds: NodeId[];
}

export interface LabelReferenceNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "label_reference";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    names: NodeId;
    childrenIds: NodeId[];
}

export interface LabelReferenceRangeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "label_reference_range";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    from: NodeId;
    to: NodeId;
    childrenIds: NodeId[];
}

export interface LatexIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "latex_include";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    path: NodeId;
    childrenIds: NodeId[];
}

export interface LetCommandDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "let_command_definition";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    declaration: NodeId;
    implementation: NodeId;
    childrenIds: NodeId[];
}

export interface ListingEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "listing_environment";
    text: string;
    startIndex: number;
    endIndex: number;
    begin: NodeId;
    code: NodeId;
    end: NodeId;
    childrenIds: NodeId[];
}

export interface LuacodeEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "luacode_environment";
    text: string;
    startIndex: number;
    endIndex: number;
    begin: NodeId;
    code: NodeId;
    end: NodeId;
    childrenIds: NodeId[];
}

export interface MathDelimiterNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "math_delimiter";
    text: string;
    startIndex: number;
    endIndex: number;
    left_command: NodeId;
    left_delimiter: NodeId;
    right_command: NodeId;
    right_delimiter: NodeId;
    childrenIds: NodeId[];
}

export interface MathEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "math_environment";
    text: string;
    startIndex: number;
    endIndex: number;
    begin: NodeId;
    end: NodeId;
    childrenIds: NodeId[];
}

export interface MintedEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "minted_environment";
    text: string;
    startIndex: number;
    endIndex: number;
    begin: NodeId;
    code: NodeId;
    end: NodeId;
    childrenIds: NodeId[];
}

export interface NewCommandDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "new_command_definition";
    text: string;
    startIndex: number;
    endIndex: number;
    argc?: NodeId;
    command: NodeId;
    declaration: NodeId;
    default?: NodeId;
    implementation: NodeId;
    spec?: NodeId;
    childrenIds: NodeId[];
}

export interface OldCommandDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "old_command_definition";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    declaration: NodeId;
    childrenIds: NodeId[];
}

export interface OperatorNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "operator";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface PackageIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "package_include";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    options?: NodeId;
    paths: NodeId;
    childrenIds: NodeId[];
}

export interface PairedDelimiterDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "paired_delimiter_definition";
    text: string;
    startIndex: number;
    endIndex: number;
    argc?: NodeId;
    body?: NodeId;
    command: NodeId;
    declaration: NodeId;
    left: NodeId;
    right: NodeId;
    childrenIds: NodeId[];
}

export interface ParagraphNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "paragraph";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    toc?: NodeId;
    childrenIds: NodeId[];
}

export interface PartNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "part";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    toc?: NodeId;
    childrenIds: NodeId[];
}

export interface PycodeEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "pycode_environment";
    text: string;
    startIndex: number;
    endIndex: number;
    begin: NodeId;
    code: NodeId;
    end: NodeId;
    childrenIds: NodeId[];
}

export interface SageblockEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "sageblock_environment";
    text: string;
    startIndex: number;
    endIndex: number;
    begin: NodeId;
    code: NodeId;
    end: NodeId;
    childrenIds: NodeId[];
}

export interface SagesilentEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "sagesilent_environment";
    text: string;
    startIndex: number;
    endIndex: number;
    begin: NodeId;
    code: NodeId;
    end: NodeId;
    childrenIds: NodeId[];
}

export interface SectionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "section";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    toc?: NodeId;
    childrenIds: NodeId[];
}

export interface SourceFileNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "source_file";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface SubparagraphNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "subparagraph";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    toc?: NodeId;
    childrenIds: NodeId[];
}

export interface SubscriptNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "subscript";
    text: string;
    startIndex: number;
    endIndex: number;
    subscript: NodeId;
    childrenIds: NodeId[];
}

export interface SubsectionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "subsection";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    toc?: NodeId;
    childrenIds: NodeId[];
}

export interface SubsubsectionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "subsubsection";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    toc?: NodeId;
    childrenIds: NodeId[];
}

export interface SuperscriptNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "superscript";
    text: string;
    startIndex: number;
    endIndex: number;
    superscript: NodeId;
    childrenIds: NodeId[];
}

export interface SvgIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "svg_include";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    options?: NodeId;
    path: NodeId;
    childrenIds: NodeId[];
}

export interface TextNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "text";
    text: string;
    startIndex: number;
    endIndex: number;
    word: NodeId[];
    childrenIds: NodeId[];
}

export interface TextModeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "text_mode";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    content: NodeId;
    childrenIds: NodeId[];
}

export interface TheoremDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "theorem_definition";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    counter?: NodeId;
    name: NodeId;
    options?: NodeId;
    title?: NodeId;
    childrenIds: NodeId[];
}

export interface TikzLibraryImportNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "tikz_library_import";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    paths: NodeId;
    childrenIds: NodeId[];
}

export interface TitleDeclarationNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "title_declaration";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    options?: NodeId;
    childrenIds: NodeId[];
}

export interface TodoNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "todo";
    text: string;
    startIndex: number;
    endIndex: number;
    arg: NodeId;
    command: NodeId;
    options?: NodeId;
    childrenIds: NodeId[];
}

export interface ValueNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "value";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface VerbatimEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "verbatim_environment";
    text: string;
    startIndex: number;
    endIndex: number;
    begin: NodeId;
    end: NodeId;
    verbatim: NodeId;
    childrenIds: NodeId[];
}

export interface VerbatimIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "verbatim_include";
    text: string;
    startIndex: number;
    endIndex: number;
    command: NodeId;
    path: NodeId;
    childrenIds: NodeId[];
}

export interface ArgcNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "argc";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface CommandNameNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "command_name";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface CommentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "comment";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface DelimiterNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "delimiter";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface LabelNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "label";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface LetterNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "letter";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface LineCommentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "line_comment";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface PathNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "path";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface PlaceholderNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "placeholder";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface SourceCodeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "source_code";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface TodoCommandNameNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "todo_command_name";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface UriNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "uri";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface ValueLiteralNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "value_literal";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export interface WordNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "word";
    text: string;
    startIndex: number;
    endIndex: number;
    childrenIds: NodeId[];
}

export type AstNode =
    | AcronymDefinitionNode
    | AcronymReferenceNode
    | AsyEnvironmentNode
    | AsydefEnvironmentNode
    | AuthorNode
    | AuthorDeclarationNode
    | BeginNode
    | BiblatexIncludeNode
    | BibstyleIncludeNode
    | BibtexIncludeNode
    | BlockCommentNode
    | BrackGroupNode
    | BrackGroupArgcNode
    | BrackGroupKeyValueNode
    | BrackGroupTextNode
    | BrackGroupWordNode
    | CaptionNode
    | ChangesReplacedNode
    | ChapterNode
    | CitationNode
    | ClassIncludeNode
    | ColorDefinitionNode
    | ColorReferenceNode
    | ColorSetDefinitionNode
    | CommentEnvironmentNode
    | CounterAdditionNode
    | CounterDeclarationNode
    | CounterDefinitionNode
    | CounterIncrementNode
    | CounterTypesettingNode
    | CounterValueNode
    | CounterWithinDeclarationNode
    | CounterWithoutDeclarationNode
    | CurlyGroupNode
    | CurlyGroupAuthorListNode
    | CurlyGroupCommandNameNode
    | CurlyGroupGlobPatternNode
    | CurlyGroupImplNode
    | CurlyGroupKeyValueNode
    | CurlyGroupLabelNode
    | CurlyGroupLabelListNode
    | CurlyGroupPathNode
    | CurlyGroupPathListNode
    | CurlyGroupSpecNode
    | CurlyGroupTextNode
    | CurlyGroupTextListNode
    | CurlyGroupUriNode
    | CurlyGroupValueNode
    | CurlyGroupWordNode
    | DisplayedEquationNode
    | EndNode
    | EnumItemNode
    | EnvironmentDefinitionNode
    | GenericCommandNode
    | GenericEnvironmentNode
    | GlobPatternNode
    | GlossaryEntryDefinitionNode
    | GlossaryEntryReferenceNode
    | GraphicsIncludeNode
    | HyperlinkNode
    | ImportIncludeNode
    | InkscapeIncludeNode
    | InlineFormulaNode
    | KeyValuePairNode
    | LabelDefinitionNode
    | LabelNumberNode
    | LabelReferenceNode
    | LabelReferenceRangeNode
    | LatexIncludeNode
    | LetCommandDefinitionNode
    | ListingEnvironmentNode
    | LuacodeEnvironmentNode
    | MathDelimiterNode
    | MathEnvironmentNode
    | MintedEnvironmentNode
    | NewCommandDefinitionNode
    | OldCommandDefinitionNode
    | OperatorNode
    | PackageIncludeNode
    | PairedDelimiterDefinitionNode
    | ParagraphNode
    | PartNode
    | PycodeEnvironmentNode
    | SageblockEnvironmentNode
    | SagesilentEnvironmentNode
    | SectionNode
    | SourceFileNode
    | SubparagraphNode
    | SubscriptNode
    | SubsectionNode
    | SubsubsectionNode
    | SuperscriptNode
    | SvgIncludeNode
    | TextNode
    | TextModeNode
    | TheoremDefinitionNode
    | TikzLibraryImportNode
    | TitleDeclarationNode
    | TodoNode
    | ValueNode
    | VerbatimEnvironmentNode
    | VerbatimIncludeNode
    | ArgcNode
    | CommandNameNode
    | CommentNode
    | DelimiterNode
    | LabelNode
    | LetterNode
    | LineCommentNode
    | PathNode
    | PlaceholderNode
    | SourceCodeNode
    | TodoCommandNameNode
    | UriNode
    | ValueLiteralNode
    | WordNode;

// Unmarshalers

function unmarshalerAcronymDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<AcronymDefinitionNode> = {
        id,
        parentId,
        type: "acronym_definition",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("long");
        n.long = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("name");
        n.name = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("short");
        n.short = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerAcronymReferenceNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<AcronymReferenceNode> = {
        id,
        parentId,
        type: "acronym_reference",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("name");
        n.name = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerAsyEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<AsyEnvironmentNode> = {
        id,
        parentId,
        type: "asy_environment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("begin");
        n.begin = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("code");
        n.code = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("end");
        n.end = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerAsydefEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<AsydefEnvironmentNode> = {
        id,
        parentId,
        type: "asydef_environment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("begin");
        n.begin = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("code");
        n.code = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("end");
        n.end = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerAuthorNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<AuthorNode> = {
        id,
        parentId,
        type: "author",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerAuthorDeclarationNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<AuthorDeclarationNode> = {
        id,
        parentId,
        type: "author_declaration",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("authors");
        n.authors = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerBeginNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<BeginNode> = {
        id,
        parentId,
        type: "begin",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("language");
        n.language = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("name");
        n.name = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerBiblatexIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<BiblatexIncludeNode> = {
        id,
        parentId,
        type: "biblatex_include",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("glob");
        n.glob = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerBibstyleIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<BibstyleIncludeNode> = {
        id,
        parentId,
        type: "bibstyle_include",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("path");
        n.path = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerBibtexIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<BibtexIncludeNode> = {
        id,
        parentId,
        type: "bibtex_include",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("paths");
        n.paths = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerBlockCommentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<BlockCommentNode> = {
        id,
        parentId,
        type: "block_comment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("begin");
        n.begin = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("comment");
        n.comment = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("end");
        n.end = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerBrackGroupNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<BrackGroupNode> = {
        id,
        parentId,
        type: "brack_group",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerBrackGroupArgcNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<BrackGroupArgcNode> = {
        id,
        parentId,
        type: "brack_group_argc",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("value");
        n.value = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerBrackGroupKeyValueNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<BrackGroupKeyValueNode> = {
        id,
        parentId,
        type: "brack_group_key_value",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    n.pair = node
        .childrenForFieldName("pair")
        .map((child) => n.childrenIds![node.namedChildren.indexOf(child)])
        .filter((id) => id !== undefined);

    return id;
}

function unmarshalerBrackGroupTextNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<BrackGroupTextNode> = {
        id,
        parentId,
        type: "brack_group_text",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerBrackGroupWordNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<BrackGroupWordNode> = {
        id,
        parentId,
        type: "brack_group_word",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("word");
        n.word = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCaptionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CaptionNode> = {
        id,
        parentId,
        type: "caption",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("long");
        n.long = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("short");
        n.short = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerChangesReplacedNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<ChangesReplacedNode> = {
        id,
        parentId,
        type: "changes_replaced",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("text_added");
        n.text_added = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("text_deleted");
        n.text_deleted = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerChapterNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<ChapterNode> = {
        id,
        parentId,
        type: "chapter",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("toc");
        n.toc = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCitationNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CitationNode> = {
        id,
        parentId,
        type: "citation",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("keys");
        n.keys = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("postnote");
        n.postnote = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("prenote");
        n.prenote = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerClassIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<ClassIncludeNode> = {
        id,
        parentId,
        type: "class_include",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("path");
        n.path = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerColorDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<ColorDefinitionNode> = {
        id,
        parentId,
        type: "color_definition",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("model");
        n.model = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("name");
        n.name = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("spec");
        n.spec = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerColorReferenceNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<ColorReferenceNode> = {
        id,
        parentId,
        type: "color_reference",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("model");
        n.model = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("name");
        n.name = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("spec");
        n.spec = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerColorSetDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<ColorSetDefinitionNode> = {
        id,
        parentId,
        type: "color_set_definition",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("head");
        n.head = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("model");
        n.model = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("spec");
        n.spec = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("tail");
        n.tail = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("ty");
        n.ty = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCommentEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CommentEnvironmentNode> = {
        id,
        parentId,
        type: "comment_environment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("begin");
        n.begin = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("comment");
        n.comment = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("end");
        n.end = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCounterAdditionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CounterAdditionNode> = {
        id,
        parentId,
        type: "counter_addition",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("counter");
        n.counter = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    n.value = node
        .childrenForFieldName("value")
        .map((child) => n.childrenIds![node.namedChildren.indexOf(child)])
        .filter((id) => id !== undefined);

    return id;
}

function unmarshalerCounterDeclarationNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CounterDeclarationNode> = {
        id,
        parentId,
        type: "counter_declaration",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("counter");
        n.counter = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("supercounter");
        n.supercounter = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCounterDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CounterDefinitionNode> = {
        id,
        parentId,
        type: "counter_definition",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("counter");
        n.counter = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    n.value = node
        .childrenForFieldName("value")
        .map((child) => n.childrenIds![node.namedChildren.indexOf(child)])
        .filter((id) => id !== undefined);

    return id;
}

function unmarshalerCounterIncrementNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CounterIncrementNode> = {
        id,
        parentId,
        type: "counter_increment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("counter");
        n.counter = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCounterTypesettingNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CounterTypesettingNode> = {
        id,
        parentId,
        type: "counter_typesetting",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("counter");
        n.counter = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCounterValueNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CounterValueNode> = {
        id,
        parentId,
        type: "counter_value",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("counter");
        n.counter = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCounterWithinDeclarationNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CounterWithinDeclarationNode> = {
        id,
        parentId,
        type: "counter_within_declaration",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("counter");
        n.counter = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("supercounter");
        n.supercounter = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCounterWithoutDeclarationNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CounterWithoutDeclarationNode> = {
        id,
        parentId,
        type: "counter_without_declaration",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("counter");
        n.counter = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("supercounter");
        n.supercounter = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCurlyGroupNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupNode> = {
        id,
        parentId,
        type: "curly_group",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerCurlyGroupAuthorListNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupAuthorListNode> = {
        id,
        parentId,
        type: "curly_group_author_list",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerCurlyGroupCommandNameNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupCommandNameNode> = {
        id,
        parentId,
        type: "curly_group_command_name",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCurlyGroupGlobPatternNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupGlobPatternNode> = {
        id,
        parentId,
        type: "curly_group_glob_pattern",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("pattern");
        n.pattern = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCurlyGroupImplNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupImplNode> = {
        id,
        parentId,
        type: "curly_group_impl",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerCurlyGroupKeyValueNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupKeyValueNode> = {
        id,
        parentId,
        type: "curly_group_key_value",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    n.pair = node
        .childrenForFieldName("pair")
        .map((child) => n.childrenIds![node.namedChildren.indexOf(child)])
        .filter((id) => id !== undefined);

    return id;
}

function unmarshalerCurlyGroupLabelNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupLabelNode> = {
        id,
        parentId,
        type: "curly_group_label",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("label");
        n.label = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCurlyGroupLabelListNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupLabelListNode> = {
        id,
        parentId,
        type: "curly_group_label_list",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    n.label = node
        .childrenForFieldName("label")
        .map((child) => n.childrenIds![node.namedChildren.indexOf(child)])
        .filter((id) => id !== undefined);

    return id;
}

function unmarshalerCurlyGroupPathNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupPathNode> = {
        id,
        parentId,
        type: "curly_group_path",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("path");
        n.path = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCurlyGroupPathListNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupPathListNode> = {
        id,
        parentId,
        type: "curly_group_path_list",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    n.path = node
        .childrenForFieldName("path")
        .map((child) => n.childrenIds![node.namedChildren.indexOf(child)])
        .filter((id) => id !== undefined);

    return id;
}

function unmarshalerCurlyGroupSpecNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupSpecNode> = {
        id,
        parentId,
        type: "curly_group_spec",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerCurlyGroupTextNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupTextNode> = {
        id,
        parentId,
        type: "curly_group_text",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerCurlyGroupTextListNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupTextListNode> = {
        id,
        parentId,
        type: "curly_group_text_list",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerCurlyGroupUriNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupUriNode> = {
        id,
        parentId,
        type: "curly_group_uri",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("uri");
        n.uri = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCurlyGroupValueNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupValueNode> = {
        id,
        parentId,
        type: "curly_group_value",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("value");
        n.value = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerCurlyGroupWordNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CurlyGroupWordNode> = {
        id,
        parentId,
        type: "curly_group_word",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("word");
        n.word = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerDisplayedEquationNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<DisplayedEquationNode> = {
        id,
        parentId,
        type: "displayed_equation",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerEndNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<EndNode> = {
        id,
        parentId,
        type: "end",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("name");
        n.name = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerEnumItemNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<EnumItemNode> = {
        id,
        parentId,
        type: "enum_item",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("label");
        n.label = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerEnvironmentDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<EnvironmentDefinitionNode> = {
        id,
        parentId,
        type: "environment_definition",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("argc");
        n.argc = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("begin");
        n.begin = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("end");
        n.end = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    n.name = node
        .childrenForFieldName("name")
        .map((child) => n.childrenIds![node.namedChildren.indexOf(child)])
        .filter((id) => id !== undefined);
    {
        const _fc = node.childForFieldName("spec");
        n.spec = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerGenericCommandNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<GenericCommandNode> = {
        id,
        parentId,
        type: "generic_command",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    n.arg = node
        .childrenForFieldName("arg")
        .map((child) => n.childrenIds![node.namedChildren.indexOf(child)])
        .filter((id) => id !== undefined);
    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerGenericEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<GenericEnvironmentNode> = {
        id,
        parentId,
        type: "generic_environment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("begin");
        n.begin = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("end");
        n.end = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerGlobPatternNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<GlobPatternNode> = {
        id,
        parentId,
        type: "glob_pattern",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerGlossaryEntryDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<GlossaryEntryDefinitionNode> = {
        id,
        parentId,
        type: "glossary_entry_definition",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("name");
        n.name = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerGlossaryEntryReferenceNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<GlossaryEntryReferenceNode> = {
        id,
        parentId,
        type: "glossary_entry_reference",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("name");
        n.name = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerGraphicsIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<GraphicsIncludeNode> = {
        id,
        parentId,
        type: "graphics_include",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("path");
        n.path = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerHyperlinkNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<HyperlinkNode> = {
        id,
        parentId,
        type: "hyperlink",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("label");
        n.label = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("uri");
        n.uri = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerImportIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<ImportIncludeNode> = {
        id,
        parentId,
        type: "import_include",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("directory");
        n.directory = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("file");
        n.file = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerInkscapeIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<InkscapeIncludeNode> = {
        id,
        parentId,
        type: "inkscape_include",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("path");
        n.path = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerInlineFormulaNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<InlineFormulaNode> = {
        id,
        parentId,
        type: "inline_formula",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerKeyValuePairNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<KeyValuePairNode> = {
        id,
        parentId,
        type: "key_value_pair",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("key");
        n.key = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("value");
        n.value = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerLabelDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<LabelDefinitionNode> = {
        id,
        parentId,
        type: "label_definition",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("name");
        n.name = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerLabelNumberNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<LabelNumberNode> = {
        id,
        parentId,
        type: "label_number",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("name");
        n.name = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("number");
        n.number = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerLabelReferenceNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<LabelReferenceNode> = {
        id,
        parentId,
        type: "label_reference",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("names");
        n.names = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerLabelReferenceRangeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<LabelReferenceRangeNode> = {
        id,
        parentId,
        type: "label_reference_range",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("from");
        n.from = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("to");
        n.to = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerLatexIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<LatexIncludeNode> = {
        id,
        parentId,
        type: "latex_include",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("path");
        n.path = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerLetCommandDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<LetCommandDefinitionNode> = {
        id,
        parentId,
        type: "let_command_definition",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("declaration");
        n.declaration = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("implementation");
        n.implementation = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerListingEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<ListingEnvironmentNode> = {
        id,
        parentId,
        type: "listing_environment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("begin");
        n.begin = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("code");
        n.code = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("end");
        n.end = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerLuacodeEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<LuacodeEnvironmentNode> = {
        id,
        parentId,
        type: "luacode_environment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("begin");
        n.begin = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("code");
        n.code = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("end");
        n.end = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerMathDelimiterNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<MathDelimiterNode> = {
        id,
        parentId,
        type: "math_delimiter",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("left_command");
        n.left_command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("left_delimiter");
        n.left_delimiter = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("right_command");
        n.right_command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("right_delimiter");
        n.right_delimiter = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerMathEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<MathEnvironmentNode> = {
        id,
        parentId,
        type: "math_environment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("begin");
        n.begin = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("end");
        n.end = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerMintedEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<MintedEnvironmentNode> = {
        id,
        parentId,
        type: "minted_environment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("begin");
        n.begin = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("code");
        n.code = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("end");
        n.end = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerNewCommandDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<NewCommandDefinitionNode> = {
        id,
        parentId,
        type: "new_command_definition",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("argc");
        n.argc = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("declaration");
        n.declaration = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("default");
        n.default = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("implementation");
        n.implementation = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("spec");
        n.spec = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerOldCommandDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<OldCommandDefinitionNode> = {
        id,
        parentId,
        type: "old_command_definition",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("declaration");
        n.declaration = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerOperatorNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<OperatorNode> = {
        id,
        parentId,
        type: "operator",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerPackageIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<PackageIncludeNode> = {
        id,
        parentId,
        type: "package_include",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("paths");
        n.paths = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerPairedDelimiterDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<PairedDelimiterDefinitionNode> = {
        id,
        parentId,
        type: "paired_delimiter_definition",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("argc");
        n.argc = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("body");
        n.body = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("declaration");
        n.declaration = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("left");
        n.left = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("right");
        n.right = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerParagraphNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<ParagraphNode> = {
        id,
        parentId,
        type: "paragraph",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("toc");
        n.toc = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerPartNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<PartNode> = {
        id,
        parentId,
        type: "part",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("toc");
        n.toc = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerPycodeEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<PycodeEnvironmentNode> = {
        id,
        parentId,
        type: "pycode_environment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("begin");
        n.begin = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("code");
        n.code = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("end");
        n.end = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerSageblockEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<SageblockEnvironmentNode> = {
        id,
        parentId,
        type: "sageblock_environment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("begin");
        n.begin = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("code");
        n.code = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("end");
        n.end = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerSagesilentEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<SagesilentEnvironmentNode> = {
        id,
        parentId,
        type: "sagesilent_environment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("begin");
        n.begin = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("code");
        n.code = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("end");
        n.end = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerSectionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<SectionNode> = {
        id,
        parentId,
        type: "section",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("toc");
        n.toc = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerSourceFileNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<SourceFileNode> = {
        id,
        parentId,
        type: "source_file",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerSubparagraphNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<SubparagraphNode> = {
        id,
        parentId,
        type: "subparagraph",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("toc");
        n.toc = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerSubscriptNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<SubscriptNode> = {
        id,
        parentId,
        type: "subscript",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("subscript");
        n.subscript = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerSubsectionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<SubsectionNode> = {
        id,
        parentId,
        type: "subsection",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("toc");
        n.toc = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerSubsubsectionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<SubsubsectionNode> = {
        id,
        parentId,
        type: "subsubsection",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("toc");
        n.toc = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerSuperscriptNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<SuperscriptNode> = {
        id,
        parentId,
        type: "superscript",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("superscript");
        n.superscript = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerSvgIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<SvgIncludeNode> = {
        id,
        parentId,
        type: "svg_include",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("path");
        n.path = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerTextNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<TextNode> = {
        id,
        parentId,
        type: "text",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    n.word = node
        .childrenForFieldName("word")
        .map((child) => n.childrenIds![node.namedChildren.indexOf(child)])
        .filter((id) => id !== undefined);

    return id;
}

function unmarshalerTextModeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<TextModeNode> = {
        id,
        parentId,
        type: "text_mode",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("content");
        n.content = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerTheoremDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<TheoremDefinitionNode> = {
        id,
        parentId,
        type: "theorem_definition",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("counter");
        n.counter = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("name");
        n.name = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("title");
        n.title = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerTikzLibraryImportNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<TikzLibraryImportNode> = {
        id,
        parentId,
        type: "tikz_library_import",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("paths");
        n.paths = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerTitleDeclarationNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<TitleDeclarationNode> = {
        id,
        parentId,
        type: "title_declaration",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerTodoNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<TodoNode> = {
        id,
        parentId,
        type: "todo",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("arg");
        n.arg = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("options");
        n.options = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerValueNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<ValueNode> = {
        id,
        parentId,
        type: "value",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerVerbatimEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<VerbatimEnvironmentNode> = {
        id,
        parentId,
        type: "verbatim_environment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("begin");
        n.begin = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("end");
        n.end = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("verbatim");
        n.verbatim = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerVerbatimIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<VerbatimIncludeNode> = {
        id,
        parentId,
        type: "verbatim_include",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    {
        const _fc = node.childForFieldName("command");
        n.command = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }
    {
        const _fc = node.childForFieldName("path");
        n.path = _fc ? n.childrenIds![namedChildren.indexOf(_fc)] : undefined;
    }

    return id;
}

function unmarshalerArgcNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<ArgcNode> = {
        id,
        parentId,
        type: "argc",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerCommandNameNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CommandNameNode> = {
        id,
        parentId,
        type: "command_name",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerCommentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<CommentNode> = {
        id,
        parentId,
        type: "comment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerDelimiterNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<DelimiterNode> = {
        id,
        parentId,
        type: "delimiter",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerLabelNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<LabelNode> = {
        id,
        parentId,
        type: "label",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerLetterNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<LetterNode> = {
        id,
        parentId,
        type: "letter",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerLineCommentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<LineCommentNode> = {
        id,
        parentId,
        type: "line_comment",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerPathNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<PathNode> = {
        id,
        parentId,
        type: "path",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerPlaceholderNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<PlaceholderNode> = {
        id,
        parentId,
        type: "placeholder",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerSourceCodeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<SourceCodeNode> = {
        id,
        parentId,
        type: "source_code",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerTodoCommandNameNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<TodoCommandNameNode> = {
        id,
        parentId,
        type: "todo_command_name",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerUriNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<UriNode> = {
        id,
        parentId,
        type: "uri",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerValueLiteralNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<ValueLiteralNode> = {
        id,
        parentId,
        type: "value_literal",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

function unmarshalerWordNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const namedChildren = node.namedChildren;
    const n: Partial<WordNode> = {
        id,
        parentId,
        type: "word",
        text: namedChildren.length === 0 ? node.text : "",
        startIndex: node.startIndex,
        endIndex: node.endIndex,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = namedChildren.map((child) => unmarshalNode(child, ctx, id));

    return id;
}

// Parser core

export const unmarshalNode = (node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId => {
    switch (node.type) {
        case "acronym_definition":
            return unmarshalerAcronymDefinitionNode(node, ctx, parentId);
        case "acronym_reference":
            return unmarshalerAcronymReferenceNode(node, ctx, parentId);
        case "asy_environment":
            return unmarshalerAsyEnvironmentNode(node, ctx, parentId);
        case "asydef_environment":
            return unmarshalerAsydefEnvironmentNode(node, ctx, parentId);
        case "author":
            return unmarshalerAuthorNode(node, ctx, parentId);
        case "author_declaration":
            return unmarshalerAuthorDeclarationNode(node, ctx, parentId);
        case "begin":
            return unmarshalerBeginNode(node, ctx, parentId);
        case "biblatex_include":
            return unmarshalerBiblatexIncludeNode(node, ctx, parentId);
        case "bibstyle_include":
            return unmarshalerBibstyleIncludeNode(node, ctx, parentId);
        case "bibtex_include":
            return unmarshalerBibtexIncludeNode(node, ctx, parentId);
        case "block_comment":
            return unmarshalerBlockCommentNode(node, ctx, parentId);
        case "brack_group":
            return unmarshalerBrackGroupNode(node, ctx, parentId);
        case "brack_group_argc":
            return unmarshalerBrackGroupArgcNode(node, ctx, parentId);
        case "brack_group_key_value":
            return unmarshalerBrackGroupKeyValueNode(node, ctx, parentId);
        case "brack_group_text":
            return unmarshalerBrackGroupTextNode(node, ctx, parentId);
        case "brack_group_word":
            return unmarshalerBrackGroupWordNode(node, ctx, parentId);
        case "caption":
            return unmarshalerCaptionNode(node, ctx, parentId);
        case "changes_replaced":
            return unmarshalerChangesReplacedNode(node, ctx, parentId);
        case "chapter":
            return unmarshalerChapterNode(node, ctx, parentId);
        case "citation":
            return unmarshalerCitationNode(node, ctx, parentId);
        case "class_include":
            return unmarshalerClassIncludeNode(node, ctx, parentId);
        case "color_definition":
            return unmarshalerColorDefinitionNode(node, ctx, parentId);
        case "color_reference":
            return unmarshalerColorReferenceNode(node, ctx, parentId);
        case "color_set_definition":
            return unmarshalerColorSetDefinitionNode(node, ctx, parentId);
        case "comment_environment":
            return unmarshalerCommentEnvironmentNode(node, ctx, parentId);
        case "counter_addition":
            return unmarshalerCounterAdditionNode(node, ctx, parentId);
        case "counter_declaration":
            return unmarshalerCounterDeclarationNode(node, ctx, parentId);
        case "counter_definition":
            return unmarshalerCounterDefinitionNode(node, ctx, parentId);
        case "counter_increment":
            return unmarshalerCounterIncrementNode(node, ctx, parentId);
        case "counter_typesetting":
            return unmarshalerCounterTypesettingNode(node, ctx, parentId);
        case "counter_value":
            return unmarshalerCounterValueNode(node, ctx, parentId);
        case "counter_within_declaration":
            return unmarshalerCounterWithinDeclarationNode(node, ctx, parentId);
        case "counter_without_declaration":
            return unmarshalerCounterWithoutDeclarationNode(node, ctx, parentId);
        case "curly_group":
            return unmarshalerCurlyGroupNode(node, ctx, parentId);
        case "curly_group_author_list":
            return unmarshalerCurlyGroupAuthorListNode(node, ctx, parentId);
        case "curly_group_command_name":
            return unmarshalerCurlyGroupCommandNameNode(node, ctx, parentId);
        case "curly_group_glob_pattern":
            return unmarshalerCurlyGroupGlobPatternNode(node, ctx, parentId);
        case "curly_group_impl":
            return unmarshalerCurlyGroupImplNode(node, ctx, parentId);
        case "curly_group_key_value":
            return unmarshalerCurlyGroupKeyValueNode(node, ctx, parentId);
        case "curly_group_label":
            return unmarshalerCurlyGroupLabelNode(node, ctx, parentId);
        case "curly_group_label_list":
            return unmarshalerCurlyGroupLabelListNode(node, ctx, parentId);
        case "curly_group_path":
            return unmarshalerCurlyGroupPathNode(node, ctx, parentId);
        case "curly_group_path_list":
            return unmarshalerCurlyGroupPathListNode(node, ctx, parentId);
        case "curly_group_spec":
            return unmarshalerCurlyGroupSpecNode(node, ctx, parentId);
        case "curly_group_text":
            return unmarshalerCurlyGroupTextNode(node, ctx, parentId);
        case "curly_group_text_list":
            return unmarshalerCurlyGroupTextListNode(node, ctx, parentId);
        case "curly_group_uri":
            return unmarshalerCurlyGroupUriNode(node, ctx, parentId);
        case "curly_group_value":
            return unmarshalerCurlyGroupValueNode(node, ctx, parentId);
        case "curly_group_word":
            return unmarshalerCurlyGroupWordNode(node, ctx, parentId);
        case "displayed_equation":
            return unmarshalerDisplayedEquationNode(node, ctx, parentId);
        case "end":
            return unmarshalerEndNode(node, ctx, parentId);
        case "enum_item":
            return unmarshalerEnumItemNode(node, ctx, parentId);
        case "environment_definition":
            return unmarshalerEnvironmentDefinitionNode(node, ctx, parentId);
        case "generic_command":
            return unmarshalerGenericCommandNode(node, ctx, parentId);
        case "generic_environment":
            return unmarshalerGenericEnvironmentNode(node, ctx, parentId);
        case "glob_pattern":
            return unmarshalerGlobPatternNode(node, ctx, parentId);
        case "glossary_entry_definition":
            return unmarshalerGlossaryEntryDefinitionNode(node, ctx, parentId);
        case "glossary_entry_reference":
            return unmarshalerGlossaryEntryReferenceNode(node, ctx, parentId);
        case "graphics_include":
            return unmarshalerGraphicsIncludeNode(node, ctx, parentId);
        case "hyperlink":
            return unmarshalerHyperlinkNode(node, ctx, parentId);
        case "import_include":
            return unmarshalerImportIncludeNode(node, ctx, parentId);
        case "inkscape_include":
            return unmarshalerInkscapeIncludeNode(node, ctx, parentId);
        case "inline_formula":
            return unmarshalerInlineFormulaNode(node, ctx, parentId);
        case "key_value_pair":
            return unmarshalerKeyValuePairNode(node, ctx, parentId);
        case "label_definition":
            return unmarshalerLabelDefinitionNode(node, ctx, parentId);
        case "label_number":
            return unmarshalerLabelNumberNode(node, ctx, parentId);
        case "label_reference":
            return unmarshalerLabelReferenceNode(node, ctx, parentId);
        case "label_reference_range":
            return unmarshalerLabelReferenceRangeNode(node, ctx, parentId);
        case "latex_include":
            return unmarshalerLatexIncludeNode(node, ctx, parentId);
        case "let_command_definition":
            return unmarshalerLetCommandDefinitionNode(node, ctx, parentId);
        case "listing_environment":
            return unmarshalerListingEnvironmentNode(node, ctx, parentId);
        case "luacode_environment":
            return unmarshalerLuacodeEnvironmentNode(node, ctx, parentId);
        case "math_delimiter":
            return unmarshalerMathDelimiterNode(node, ctx, parentId);
        case "math_environment":
            return unmarshalerMathEnvironmentNode(node, ctx, parentId);
        case "minted_environment":
            return unmarshalerMintedEnvironmentNode(node, ctx, parentId);
        case "new_command_definition":
            return unmarshalerNewCommandDefinitionNode(node, ctx, parentId);
        case "old_command_definition":
            return unmarshalerOldCommandDefinitionNode(node, ctx, parentId);
        case "operator":
            return unmarshalerOperatorNode(node, ctx, parentId);
        case "package_include":
            return unmarshalerPackageIncludeNode(node, ctx, parentId);
        case "paired_delimiter_definition":
            return unmarshalerPairedDelimiterDefinitionNode(node, ctx, parentId);
        case "paragraph":
            return unmarshalerParagraphNode(node, ctx, parentId);
        case "part":
            return unmarshalerPartNode(node, ctx, parentId);
        case "pycode_environment":
            return unmarshalerPycodeEnvironmentNode(node, ctx, parentId);
        case "sageblock_environment":
            return unmarshalerSageblockEnvironmentNode(node, ctx, parentId);
        case "sagesilent_environment":
            return unmarshalerSagesilentEnvironmentNode(node, ctx, parentId);
        case "section":
            return unmarshalerSectionNode(node, ctx, parentId);
        case "source_file":
            return unmarshalerSourceFileNode(node, ctx, parentId);
        case "subparagraph":
            return unmarshalerSubparagraphNode(node, ctx, parentId);
        case "subscript":
            return unmarshalerSubscriptNode(node, ctx, parentId);
        case "subsection":
            return unmarshalerSubsectionNode(node, ctx, parentId);
        case "subsubsection":
            return unmarshalerSubsubsectionNode(node, ctx, parentId);
        case "superscript":
            return unmarshalerSuperscriptNode(node, ctx, parentId);
        case "svg_include":
            return unmarshalerSvgIncludeNode(node, ctx, parentId);
        case "text":
            return unmarshalerTextNode(node, ctx, parentId);
        case "text_mode":
            return unmarshalerTextModeNode(node, ctx, parentId);
        case "theorem_definition":
            return unmarshalerTheoremDefinitionNode(node, ctx, parentId);
        case "tikz_library_import":
            return unmarshalerTikzLibraryImportNode(node, ctx, parentId);
        case "title_declaration":
            return unmarshalerTitleDeclarationNode(node, ctx, parentId);
        case "todo":
            return unmarshalerTodoNode(node, ctx, parentId);
        case "value":
            return unmarshalerValueNode(node, ctx, parentId);
        case "verbatim_environment":
            return unmarshalerVerbatimEnvironmentNode(node, ctx, parentId);
        case "verbatim_include":
            return unmarshalerVerbatimIncludeNode(node, ctx, parentId);
        case "argc":
            return unmarshalerArgcNode(node, ctx, parentId);
        case "command_name":
            return unmarshalerCommandNameNode(node, ctx, parentId);
        case "comment":
            return unmarshalerCommentNode(node, ctx, parentId);
        case "delimiter":
            return unmarshalerDelimiterNode(node, ctx, parentId);
        case "label":
            return unmarshalerLabelNode(node, ctx, parentId);
        case "letter":
            return unmarshalerLetterNode(node, ctx, parentId);
        case "line_comment":
            return unmarshalerLineCommentNode(node, ctx, parentId);
        case "path":
            return unmarshalerPathNode(node, ctx, parentId);
        case "placeholder":
            return unmarshalerPlaceholderNode(node, ctx, parentId);
        case "source_code":
            return unmarshalerSourceCodeNode(node, ctx, parentId);
        case "todo_command_name":
            return unmarshalerTodoCommandNameNode(node, ctx, parentId);
        case "uri":
            return unmarshalerUriNode(node, ctx, parentId);
        case "value_literal":
            return unmarshalerValueLiteralNode(node, ctx, parentId);
        case "word":
            return unmarshalerWordNode(node, ctx, parentId);

        default: {
            const id = v4();
            const namedChildren = node.namedChildren;
            const n = {
                id,
                parentId,
                type: node.type as any,
                text: namedChildren.length === 0 ? node.text : "",
                childrenIds: [] as NodeId[],
            };
            ctx.nodes.set(id, n as AstNode);
            n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
            return id;
        }
    }
};

export type BragiAST = { rootId: NodeId; nodes: Map<NodeId, AstNode> };

// Parses a treesitter CST into a Bragi AST node map
export const parseCST = (root: Node | null): BragiAST => {
    if (!root) throw new Error("No root node provided");
    const ctx: ParserContext = { nodes: new Map() };
    const rootId = unmarshalNode(root, ctx, null);
    return { rootId, nodes: ctx.nodes };
};

export const allChildIds = (ast: BragiAST, node: AstNode): string[] => {
    return node.childrenIds;
};
