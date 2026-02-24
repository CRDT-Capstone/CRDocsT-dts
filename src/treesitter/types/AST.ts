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
    childrenIds: NodeId[];
}

export interface AuthorDeclarationNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "author_declaration";
    text: string;
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
    glob: NodeId;
    options?: NodeId;
    childrenIds: NodeId[];
}

export interface BibstyleIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "bibstyle_include";
    text: string;
    command: NodeId;
    path: NodeId;
    childrenIds: NodeId[];
}

export interface BibtexIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "bibtex_include";
    text: string;
    command: NodeId;
    paths: NodeId;
    childrenIds: NodeId[];
}

export interface BlockCommentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "block_comment";
    text: string;
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
    childrenIds: NodeId[];
}

export interface BrackGroupArgcNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "brack_group_argc";
    text: string;
    value: NodeId;
    childrenIds: NodeId[];
}

export interface BrackGroupKeyValueNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "brack_group_key_value";
    text: string;
    pair?: NodeId[];
    childrenIds: NodeId[];
}

export interface BrackGroupTextNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "brack_group_text";
    text: string | NodeId;
    childrenIds: NodeId[];
}

export interface BrackGroupWordNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "brack_group_word";
    text: string;
    word: NodeId;
    childrenIds: NodeId[];
}

export interface CaptionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "caption";
    text: string;
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
    command: NodeId;
    text_added: NodeId;
    text_deleted: NodeId;
    childrenIds: NodeId[];
}

export interface ChapterNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "chapter";
    text: string | NodeId;
    command: NodeId;
    toc?: NodeId;
    childrenIds: NodeId[];
}

export interface CitationNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "citation";
    text: string;
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
    text: string | NodeId;
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
    command: NodeId;
    counter: NodeId;
    childrenIds: NodeId[];
}

export interface CounterTypesettingNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "counter_typesetting";
    text: string;
    command: NodeId;
    counter: NodeId;
    childrenIds: NodeId[];
}

export interface CounterValueNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "counter_value";
    text: string;
    command: NodeId;
    counter: NodeId;
    childrenIds: NodeId[];
}

export interface CounterWithinDeclarationNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "counter_within_declaration";
    text: string;
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
    childrenIds: NodeId[];
}

export interface CurlyGroupAuthorListNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_author_list";
    text: string;
    childrenIds: NodeId[];
}

export interface CurlyGroupCommandNameNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_command_name";
    text: string;
    command: NodeId;
    childrenIds: NodeId[];
}

export interface CurlyGroupGlobPatternNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_glob_pattern";
    text: string;
    pattern: NodeId;
    childrenIds: NodeId[];
}

export interface CurlyGroupImplNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_impl";
    text: string;
    childrenIds: NodeId[];
}

export interface CurlyGroupKeyValueNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_key_value";
    text: string;
    pair?: NodeId[];
    childrenIds: NodeId[];
}

export interface CurlyGroupLabelNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_label";
    text: string;
    label: NodeId;
    childrenIds: NodeId[];
}

export interface CurlyGroupLabelListNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_label_list";
    text: string;
    label?: NodeId[];
    childrenIds: NodeId[];
}

export interface CurlyGroupPathNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_path";
    text: string;
    path: NodeId;
    childrenIds: NodeId[];
}

export interface CurlyGroupPathListNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_path_list";
    text: string;
    path?: NodeId[];
    childrenIds: NodeId[];
}

export interface CurlyGroupSpecNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_spec";
    text: string;
    childrenIds: NodeId[];
}

export interface CurlyGroupTextNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_text";
    text: string | NodeId;
    childrenIds: NodeId[];
}

export interface CurlyGroupTextListNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_text_list";
    text: string | NodeId[];
    childrenIds: NodeId[];
}

export interface CurlyGroupUriNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_uri";
    text: string;
    uri: NodeId;
    childrenIds: NodeId[];
}

export interface CurlyGroupValueNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_value";
    text: string;
    value: NodeId;
    childrenIds: NodeId[];
}

export interface CurlyGroupWordNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "curly_group_word";
    text: string;
    word: NodeId;
    childrenIds: NodeId[];
}

export interface DisplayedEquationNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "displayed_equation";
    text: string;
    childrenIds: NodeId[];
}

export interface EndNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "end";
    text: string;
    command: NodeId;
    name: NodeId;
    childrenIds: NodeId[];
}

export interface EnumItemNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "enum_item";
    text: string;
    command: NodeId;
    label?: NodeId;
    childrenIds: NodeId[];
}

export interface EnvironmentDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "environment_definition";
    text: string;
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
    arg?: NodeId[];
    command: NodeId;
    childrenIds: NodeId[];
}

export interface GenericEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "generic_environment";
    text: string;
    begin: NodeId;
    end: NodeId;
    childrenIds: NodeId[];
}

export interface GlobPatternNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "glob_pattern";
    text: string;
    childrenIds: NodeId[];
}

export interface GlossaryEntryDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "glossary_entry_definition";
    text: string;
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
    childrenIds: NodeId[];
}

export interface KeyValuePairNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "key_value_pair";
    text: string;
    key: NodeId;
    value?: NodeId;
    childrenIds: NodeId[];
}

export interface LabelDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "label_definition";
    text: string;
    command: NodeId;
    name: NodeId;
    childrenIds: NodeId[];
}

export interface LabelNumberNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "label_number";
    text: string;
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
    command: NodeId;
    names: NodeId;
    childrenIds: NodeId[];
}

export interface LabelReferenceRangeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "label_reference_range";
    text: string;
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
    command: NodeId;
    path: NodeId;
    childrenIds: NodeId[];
}

export interface LetCommandDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "let_command_definition";
    text: string;
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
    begin: NodeId;
    end: NodeId;
    childrenIds: NodeId[];
}

export interface MintedEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "minted_environment";
    text: string;
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
    command: NodeId;
    declaration: NodeId;
    childrenIds: NodeId[];
}

export interface OperatorNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "operator";
    text: string;
    childrenIds: NodeId[];
}

export interface PackageIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "package_include";
    text: string;
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
    text: string | NodeId;
    command: NodeId;
    toc?: NodeId;
    childrenIds: NodeId[];
}

export interface PartNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "part";
    text: string | NodeId;
    command: NodeId;
    toc?: NodeId;
    childrenIds: NodeId[];
}

export interface PycodeEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "pycode_environment";
    text: string;
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
    begin: NodeId;
    code: NodeId;
    end: NodeId;
    childrenIds: NodeId[];
}

export interface SectionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "section";
    text: string | NodeId;
    command: NodeId;
    toc?: NodeId;
    childrenIds: NodeId[];
}

export interface SourceFileNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "source_file";
    text: string;
    childrenIds: NodeId[];
}

export interface SubparagraphNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "subparagraph";
    text: string | NodeId;
    command: NodeId;
    toc?: NodeId;
    childrenIds: NodeId[];
}

export interface SubscriptNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "subscript";
    text: string;
    subscript: NodeId;
    childrenIds: NodeId[];
}

export interface SubsectionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "subsection";
    text: string | NodeId;
    command: NodeId;
    toc?: NodeId;
    childrenIds: NodeId[];
}

export interface SubsubsectionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "subsubsection";
    text: string | NodeId;
    command: NodeId;
    toc?: NodeId;
    childrenIds: NodeId[];
}

export interface SuperscriptNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "superscript";
    text: string;
    superscript: NodeId;
    childrenIds: NodeId[];
}

export interface SvgIncludeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "svg_include";
    text: string;
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
    word: NodeId[];
    childrenIds: NodeId[];
}

export interface TextModeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "text_mode";
    text: string;
    command: NodeId;
    content: NodeId;
    childrenIds: NodeId[];
}

export interface TheoremDefinitionNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "theorem_definition";
    text: string;
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
    command: NodeId;
    paths: NodeId;
    childrenIds: NodeId[];
}

export interface TitleDeclarationNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "title_declaration";
    text: string | NodeId;
    command: NodeId;
    options?: NodeId;
    childrenIds: NodeId[];
}

export interface TodoNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "todo";
    text: string;
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
    childrenIds: NodeId[];
}

export interface VerbatimEnvironmentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "verbatim_environment";
    text: string;
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
    command: NodeId;
    path: NodeId;
    childrenIds: NodeId[];
}

export interface ArgcNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "argc";
    text: string;
    childrenIds: NodeId[];
}

export interface CommandNameNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "command_name";
    text: string;
    childrenIds: NodeId[];
}

export interface CommentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "comment";
    text: string;
    childrenIds: NodeId[];
}

export interface DelimiterNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "delimiter";
    text: string;
    childrenIds: NodeId[];
}

export interface LabelNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "label";
    text: string;
    childrenIds: NodeId[];
}

export interface LetterNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "letter";
    text: string;
    childrenIds: NodeId[];
}

export interface LineCommentNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "line_comment";
    text: string;
    childrenIds: NodeId[];
}

export interface PathNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "path";
    text: string;
    childrenIds: NodeId[];
}

export interface PlaceholderNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "placeholder";
    text: string;
    childrenIds: NodeId[];
}

export interface SourceCodeNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "source_code";
    text: string;
    childrenIds: NodeId[];
}

export interface TodoCommandNameNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "todo_command_name";
    text: string;
    childrenIds: NodeId[];
}

export interface UriNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "uri";
    text: string;
    childrenIds: NodeId[];
}

export interface ValueLiteralNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "value_literal";
    text: string;
    childrenIds: NodeId[];
}

export interface WordNode {
    id: NodeId;
    parentId: NodeId | null;
    type: "word";
    text: string;
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
    const n: Partial<AcronymDefinitionNode> = {
        id,
        parentId,
        type: "acronym_definition",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.long = unmarshalNode(node.childForFieldName("long")!, ctx, id);
    n.name = unmarshalNode(node.childForFieldName("name")!, ctx, id);
    const optionsNode = node.childForFieldName("options");
    n.options = optionsNode ? unmarshalNode(optionsNode, ctx, id) : undefined;
    n.short = unmarshalNode(node.childForFieldName("short")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("long")!.id,
            node.childForFieldName("name")!.id,
            optionsNode ? optionsNode.id : undefined,
            node.childForFieldName("short")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerAcronymReferenceNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<AcronymReferenceNode> = {
        id,
        parentId,
        type: "acronym_reference",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.name = unmarshalNode(node.childForFieldName("name")!, ctx, id);
    const optionsNode = node.childForFieldName("options");
    n.options = optionsNode ? unmarshalNode(optionsNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("name")!.id,
            optionsNode ? optionsNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerAsyEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<AsyEnvironmentNode> = {
        id,
        parentId,
        type: "asy_environment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.begin = unmarshalNode(node.childForFieldName("begin")!, ctx, id);
    n.code = unmarshalNode(node.childForFieldName("code")!, ctx, id);
    n.end = unmarshalNode(node.childForFieldName("end")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("begin")!.id,
            node.childForFieldName("code")!.id,
            node.childForFieldName("end")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerAsydefEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<AsydefEnvironmentNode> = {
        id,
        parentId,
        type: "asydef_environment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.begin = unmarshalNode(node.childForFieldName("begin")!, ctx, id);
    n.code = unmarshalNode(node.childForFieldName("code")!, ctx, id);
    n.end = unmarshalNode(node.childForFieldName("end")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("begin")!.id,
            node.childForFieldName("code")!.id,
            node.childForFieldName("end")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerAuthorNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<AuthorNode> = {
        id,
        parentId,
        type: "author",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerAuthorDeclarationNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<AuthorDeclarationNode> = {
        id,
        parentId,
        type: "author_declaration",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.authors = unmarshalNode(node.childForFieldName("authors")!, ctx, id);
    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const optionsNode = node.childForFieldName("options");
    n.options = optionsNode ? unmarshalNode(optionsNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("authors")!.id,
            node.childForFieldName("command")!.id,
            optionsNode ? optionsNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerBeginNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<BeginNode> = {
        id,
        parentId,
        type: "begin",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const languageNode = node.childForFieldName("language");
    n.language = languageNode ? unmarshalNode(languageNode, ctx, id) : undefined;
    n.name = unmarshalNode(node.childForFieldName("name")!, ctx, id);
    const optionsNode = node.childForFieldName("options");
    n.options = optionsNode ? unmarshalNode(optionsNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            languageNode ? languageNode.id : undefined,
            node.childForFieldName("name")!.id,
            optionsNode ? optionsNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerBiblatexIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<BiblatexIncludeNode> = {
        id,
        parentId,
        type: "biblatex_include",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.glob = unmarshalNode(node.childForFieldName("glob")!, ctx, id);
    const optionsNode = node.childForFieldName("options");
    n.options = optionsNode ? unmarshalNode(optionsNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [node.childForFieldName("glob")!.id, optionsNode ? optionsNode.id : undefined].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerBibstyleIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<BibstyleIncludeNode> = {
        id,
        parentId,
        type: "bibstyle_include",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.path = unmarshalNode(node.childForFieldName("path")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("command")!.id, node.childForFieldName("path")!.id].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerBibtexIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<BibtexIncludeNode> = {
        id,
        parentId,
        type: "bibtex_include",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.paths = unmarshalNode(node.childForFieldName("paths")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("command")!.id, node.childForFieldName("paths")!.id].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerBlockCommentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<BlockCommentNode> = {
        id,
        parentId,
        type: "block_comment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.begin = unmarshalNode(node.childForFieldName("begin")!, ctx, id);
    const commentNode = node.childForFieldName("comment");
    n.comment = commentNode ? unmarshalNode(commentNode, ctx, id) : undefined;
    const endNode = node.childForFieldName("end");
    n.end = endNode ? unmarshalNode(endNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("begin")!.id,
            commentNode ? commentNode.id : undefined,
            endNode ? endNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerBrackGroupNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<BrackGroupNode> = {
        id,
        parentId,
        type: "brack_group",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerBrackGroupArgcNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<BrackGroupArgcNode> = {
        id,
        parentId,
        type: "brack_group_argc",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.value = unmarshalNode(node.childForFieldName("value")!, ctx, id);

    const fieldNodes = new Set([node.childForFieldName("value")!.id].filter((id) => id !== undefined));
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerBrackGroupKeyValueNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<BrackGroupKeyValueNode> = {
        id,
        parentId,
        type: "brack_group_key_value",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.pair = node.childrenForFieldName("pair").map((n) => unmarshalNode(n, ctx, id));

    const fieldNodes = new Set(
        [...node.childrenForFieldName("pair").map((n) => n.id)].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerBrackGroupTextNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<BrackGroupTextNode> = {
        id,
        parentId,
        type: "brack_group_text",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.text = unmarshalNode(node.childForFieldName("text")!, ctx, id);

    const fieldNodes = new Set([node.childForFieldName("text")!.id].filter((id) => id !== undefined));
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerBrackGroupWordNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<BrackGroupWordNode> = {
        id,
        parentId,
        type: "brack_group_word",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.word = unmarshalNode(node.childForFieldName("word")!, ctx, id);

    const fieldNodes = new Set([node.childForFieldName("word")!.id].filter((id) => id !== undefined));
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCaptionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CaptionNode> = {
        id,
        parentId,
        type: "caption",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.long = unmarshalNode(node.childForFieldName("long")!, ctx, id);
    const shortNode = node.childForFieldName("short");
    n.short = shortNode ? unmarshalNode(shortNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("long")!.id,
            shortNode ? shortNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerChangesReplacedNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<ChangesReplacedNode> = {
        id,
        parentId,
        type: "changes_replaced",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.text_added = unmarshalNode(node.childForFieldName("text_added")!, ctx, id);
    n.text_deleted = unmarshalNode(node.childForFieldName("text_deleted")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("text_added")!.id,
            node.childForFieldName("text_deleted")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerChapterNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<ChapterNode> = {
        id,
        parentId,
        type: "chapter",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const textNode = node.childForFieldName("text");
    n.text = textNode ? unmarshalNode(textNode, ctx, id) : undefined;
    const tocNode = node.childForFieldName("toc");
    n.toc = tocNode ? unmarshalNode(tocNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            textNode ? textNode.id : undefined,
            tocNode ? tocNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCitationNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CitationNode> = {
        id,
        parentId,
        type: "citation",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.keys = unmarshalNode(node.childForFieldName("keys")!, ctx, id);
    const postnoteNode = node.childForFieldName("postnote");
    n.postnote = postnoteNode ? unmarshalNode(postnoteNode, ctx, id) : undefined;
    const prenoteNode = node.childForFieldName("prenote");
    n.prenote = prenoteNode ? unmarshalNode(prenoteNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("keys")!.id,
            postnoteNode ? postnoteNode.id : undefined,
            prenoteNode ? prenoteNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerClassIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<ClassIncludeNode> = {
        id,
        parentId,
        type: "class_include",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const optionsNode = node.childForFieldName("options");
    n.options = optionsNode ? unmarshalNode(optionsNode, ctx, id) : undefined;
    n.path = unmarshalNode(node.childForFieldName("path")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            optionsNode ? optionsNode.id : undefined,
            node.childForFieldName("path")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerColorDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<ColorDefinitionNode> = {
        id,
        parentId,
        type: "color_definition",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.model = unmarshalNode(node.childForFieldName("model")!, ctx, id);
    n.name = unmarshalNode(node.childForFieldName("name")!, ctx, id);
    n.spec = unmarshalNode(node.childForFieldName("spec")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("model")!.id,
            node.childForFieldName("name")!.id,
            node.childForFieldName("spec")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerColorReferenceNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<ColorReferenceNode> = {
        id,
        parentId,
        type: "color_reference",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const modelNode = node.childForFieldName("model");
    n.model = modelNode ? unmarshalNode(modelNode, ctx, id) : undefined;
    const nameNode = node.childForFieldName("name");
    n.name = nameNode ? unmarshalNode(nameNode, ctx, id) : undefined;
    const specNode = node.childForFieldName("spec");
    n.spec = specNode ? unmarshalNode(specNode, ctx, id) : undefined;
    const textNode = node.childForFieldName("text");
    n.text = textNode ? unmarshalNode(textNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            modelNode ? modelNode.id : undefined,
            nameNode ? nameNode.id : undefined,
            specNode ? specNode.id : undefined,
            textNode ? textNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerColorSetDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<ColorSetDefinitionNode> = {
        id,
        parentId,
        type: "color_set_definition",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.head = unmarshalNode(node.childForFieldName("head")!, ctx, id);
    n.model = unmarshalNode(node.childForFieldName("model")!, ctx, id);
    n.spec = unmarshalNode(node.childForFieldName("spec")!, ctx, id);
    n.tail = unmarshalNode(node.childForFieldName("tail")!, ctx, id);
    const tyNode = node.childForFieldName("ty");
    n.ty = tyNode ? unmarshalNode(tyNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("head")!.id,
            node.childForFieldName("model")!.id,
            node.childForFieldName("spec")!.id,
            node.childForFieldName("tail")!.id,
            tyNode ? tyNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCommentEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CommentEnvironmentNode> = {
        id,
        parentId,
        type: "comment_environment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.begin = unmarshalNode(node.childForFieldName("begin")!, ctx, id);
    n.comment = unmarshalNode(node.childForFieldName("comment")!, ctx, id);
    n.end = unmarshalNode(node.childForFieldName("end")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("begin")!.id,
            node.childForFieldName("comment")!.id,
            node.childForFieldName("end")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCounterAdditionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CounterAdditionNode> = {
        id,
        parentId,
        type: "counter_addition",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.counter = unmarshalNode(node.childForFieldName("counter")!, ctx, id);
    n.value = node.childrenForFieldName("value").map((n) => unmarshalNode(n, ctx, id));

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("counter")!.id,
            ...node.childrenForFieldName("value").map((n) => n.id),
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCounterDeclarationNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CounterDeclarationNode> = {
        id,
        parentId,
        type: "counter_declaration",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.counter = unmarshalNode(node.childForFieldName("counter")!, ctx, id);
    const supercounterNode = node.childForFieldName("supercounter");
    n.supercounter = supercounterNode ? unmarshalNode(supercounterNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("counter")!.id,
            supercounterNode ? supercounterNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCounterDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CounterDefinitionNode> = {
        id,
        parentId,
        type: "counter_definition",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.counter = unmarshalNode(node.childForFieldName("counter")!, ctx, id);
    n.value = node.childrenForFieldName("value").map((n) => unmarshalNode(n, ctx, id));

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("counter")!.id,
            ...node.childrenForFieldName("value").map((n) => n.id),
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCounterIncrementNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CounterIncrementNode> = {
        id,
        parentId,
        type: "counter_increment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.counter = unmarshalNode(node.childForFieldName("counter")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("command")!.id, node.childForFieldName("counter")!.id].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCounterTypesettingNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CounterTypesettingNode> = {
        id,
        parentId,
        type: "counter_typesetting",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.counter = unmarshalNode(node.childForFieldName("counter")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("command")!.id, node.childForFieldName("counter")!.id].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCounterValueNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CounterValueNode> = {
        id,
        parentId,
        type: "counter_value",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.counter = unmarshalNode(node.childForFieldName("counter")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("command")!.id, node.childForFieldName("counter")!.id].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCounterWithinDeclarationNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CounterWithinDeclarationNode> = {
        id,
        parentId,
        type: "counter_within_declaration",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.counter = unmarshalNode(node.childForFieldName("counter")!, ctx, id);
    n.supercounter = unmarshalNode(node.childForFieldName("supercounter")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("counter")!.id,
            node.childForFieldName("supercounter")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCounterWithoutDeclarationNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CounterWithoutDeclarationNode> = {
        id,
        parentId,
        type: "counter_without_declaration",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.counter = unmarshalNode(node.childForFieldName("counter")!, ctx, id);
    n.supercounter = unmarshalNode(node.childForFieldName("supercounter")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("counter")!.id,
            node.childForFieldName("supercounter")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupNode> = {
        id,
        parentId,
        type: "curly_group",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupAuthorListNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupAuthorListNode> = {
        id,
        parentId,
        type: "curly_group_author_list",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupCommandNameNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupCommandNameNode> = {
        id,
        parentId,
        type: "curly_group_command_name",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);

    const fieldNodes = new Set([node.childForFieldName("command")!.id].filter((id) => id !== undefined));
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupGlobPatternNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupGlobPatternNode> = {
        id,
        parentId,
        type: "curly_group_glob_pattern",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.pattern = unmarshalNode(node.childForFieldName("pattern")!, ctx, id);

    const fieldNodes = new Set([node.childForFieldName("pattern")!.id].filter((id) => id !== undefined));
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupImplNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupImplNode> = {
        id,
        parentId,
        type: "curly_group_impl",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupKeyValueNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupKeyValueNode> = {
        id,
        parentId,
        type: "curly_group_key_value",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.pair = node.childrenForFieldName("pair").map((n) => unmarshalNode(n, ctx, id));

    const fieldNodes = new Set(
        [...node.childrenForFieldName("pair").map((n) => n.id)].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupLabelNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupLabelNode> = {
        id,
        parentId,
        type: "curly_group_label",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.label = unmarshalNode(node.childForFieldName("label")!, ctx, id);

    const fieldNodes = new Set([node.childForFieldName("label")!.id].filter((id) => id !== undefined));
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupLabelListNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupLabelListNode> = {
        id,
        parentId,
        type: "curly_group_label_list",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.label = node.childrenForFieldName("label").map((n) => unmarshalNode(n, ctx, id));

    const fieldNodes = new Set(
        [...node.childrenForFieldName("label").map((n) => n.id)].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupPathNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupPathNode> = {
        id,
        parentId,
        type: "curly_group_path",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.path = unmarshalNode(node.childForFieldName("path")!, ctx, id);

    const fieldNodes = new Set([node.childForFieldName("path")!.id].filter((id) => id !== undefined));
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupPathListNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupPathListNode> = {
        id,
        parentId,
        type: "curly_group_path_list",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.path = node.childrenForFieldName("path").map((n) => unmarshalNode(n, ctx, id));

    const fieldNodes = new Set(
        [...node.childrenForFieldName("path").map((n) => n.id)].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupSpecNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupSpecNode> = {
        id,
        parentId,
        type: "curly_group_spec",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupTextNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupTextNode> = {
        id,
        parentId,
        type: "curly_group_text",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.text = unmarshalNode(node.childForFieldName("text")!, ctx, id);

    const fieldNodes = new Set([node.childForFieldName("text")!.id].filter((id) => id !== undefined));
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupTextListNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupTextListNode> = {
        id,
        parentId,
        type: "curly_group_text_list",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.text = node.childrenForFieldName("text").map((n) => unmarshalNode(n, ctx, id));

    const fieldNodes = new Set(
        [...node.childrenForFieldName("text").map((n) => n.id)].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupUriNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupUriNode> = {
        id,
        parentId,
        type: "curly_group_uri",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.uri = unmarshalNode(node.childForFieldName("uri")!, ctx, id);

    const fieldNodes = new Set([node.childForFieldName("uri")!.id].filter((id) => id !== undefined));
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupValueNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupValueNode> = {
        id,
        parentId,
        type: "curly_group_value",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.value = unmarshalNode(node.childForFieldName("value")!, ctx, id);

    const fieldNodes = new Set([node.childForFieldName("value")!.id].filter((id) => id !== undefined));
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCurlyGroupWordNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CurlyGroupWordNode> = {
        id,
        parentId,
        type: "curly_group_word",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.word = unmarshalNode(node.childForFieldName("word")!, ctx, id);

    const fieldNodes = new Set([node.childForFieldName("word")!.id].filter((id) => id !== undefined));
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerDisplayedEquationNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<DisplayedEquationNode> = {
        id,
        parentId,
        type: "displayed_equation",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerEndNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<EndNode> = {
        id,
        parentId,
        type: "end",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.name = unmarshalNode(node.childForFieldName("name")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("command")!.id, node.childForFieldName("name")!.id].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerEnumItemNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<EnumItemNode> = {
        id,
        parentId,
        type: "enum_item",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const labelNode = node.childForFieldName("label");
    n.label = labelNode ? unmarshalNode(labelNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [node.childForFieldName("command")!.id, labelNode ? labelNode.id : undefined].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerEnvironmentDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<EnvironmentDefinitionNode> = {
        id,
        parentId,
        type: "environment_definition",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    const argcNode = node.childForFieldName("argc");
    n.argc = argcNode ? unmarshalNode(argcNode, ctx, id) : undefined;
    const beginNode = node.childForFieldName("begin");
    n.begin = beginNode ? unmarshalNode(beginNode, ctx, id) : undefined;
    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const endNode = node.childForFieldName("end");
    n.end = endNode ? unmarshalNode(endNode, ctx, id) : undefined;
    n.name = node.childrenForFieldName("name").map((n) => unmarshalNode(n, ctx, id));
    const specNode = node.childForFieldName("spec");
    n.spec = specNode ? unmarshalNode(specNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            argcNode ? argcNode.id : undefined,
            beginNode ? beginNode.id : undefined,
            node.childForFieldName("command")!.id,
            endNode ? endNode.id : undefined,
            ...node.childrenForFieldName("name").map((n) => n.id),
            specNode ? specNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerGenericCommandNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<GenericCommandNode> = {
        id,
        parentId,
        type: "generic_command",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.arg = node.childrenForFieldName("arg").map((n) => unmarshalNode(n, ctx, id));
    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);

    const fieldNodes = new Set(
        [...node.childrenForFieldName("arg").map((n) => n.id), node.childForFieldName("command")!.id].filter(
            (id) => id !== undefined,
        ),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerGenericEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<GenericEnvironmentNode> = {
        id,
        parentId,
        type: "generic_environment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.begin = unmarshalNode(node.childForFieldName("begin")!, ctx, id);
    n.end = unmarshalNode(node.childForFieldName("end")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("begin")!.id, node.childForFieldName("end")!.id].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerGlobPatternNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<GlobPatternNode> = {
        id,
        parentId,
        type: "glob_pattern",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerGlossaryEntryDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<GlossaryEntryDefinitionNode> = {
        id,
        parentId,
        type: "glossary_entry_definition",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.name = unmarshalNode(node.childForFieldName("name")!, ctx, id);
    n.options = unmarshalNode(node.childForFieldName("options")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("name")!.id,
            node.childForFieldName("options")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerGlossaryEntryReferenceNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<GlossaryEntryReferenceNode> = {
        id,
        parentId,
        type: "glossary_entry_reference",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.name = unmarshalNode(node.childForFieldName("name")!, ctx, id);
    const optionsNode = node.childForFieldName("options");
    n.options = optionsNode ? unmarshalNode(optionsNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("name")!.id,
            optionsNode ? optionsNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerGraphicsIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<GraphicsIncludeNode> = {
        id,
        parentId,
        type: "graphics_include",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const optionsNode = node.childForFieldName("options");
    n.options = optionsNode ? unmarshalNode(optionsNode, ctx, id) : undefined;
    n.path = unmarshalNode(node.childForFieldName("path")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            optionsNode ? optionsNode.id : undefined,
            node.childForFieldName("path")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerHyperlinkNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<HyperlinkNode> = {
        id,
        parentId,
        type: "hyperlink",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const labelNode = node.childForFieldName("label");
    n.label = labelNode ? unmarshalNode(labelNode, ctx, id) : undefined;
    n.uri = unmarshalNode(node.childForFieldName("uri")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            labelNode ? labelNode.id : undefined,
            node.childForFieldName("uri")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerImportIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<ImportIncludeNode> = {
        id,
        parentId,
        type: "import_include",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.directory = unmarshalNode(node.childForFieldName("directory")!, ctx, id);
    n.file = unmarshalNode(node.childForFieldName("file")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("directory")!.id,
            node.childForFieldName("file")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerInkscapeIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<InkscapeIncludeNode> = {
        id,
        parentId,
        type: "inkscape_include",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const optionsNode = node.childForFieldName("options");
    n.options = optionsNode ? unmarshalNode(optionsNode, ctx, id) : undefined;
    n.path = unmarshalNode(node.childForFieldName("path")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            optionsNode ? optionsNode.id : undefined,
            node.childForFieldName("path")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerInlineFormulaNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<InlineFormulaNode> = {
        id,
        parentId,
        type: "inline_formula",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerKeyValuePairNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<KeyValuePairNode> = {
        id,
        parentId,
        type: "key_value_pair",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.key = unmarshalNode(node.childForFieldName("key")!, ctx, id);
    const valueNode = node.childForFieldName("value");
    n.value = valueNode ? unmarshalNode(valueNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [node.childForFieldName("key")!.id, valueNode ? valueNode.id : undefined].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerLabelDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<LabelDefinitionNode> = {
        id,
        parentId,
        type: "label_definition",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.name = unmarshalNode(node.childForFieldName("name")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("command")!.id, node.childForFieldName("name")!.id].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerLabelNumberNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<LabelNumberNode> = {
        id,
        parentId,
        type: "label_number",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.name = unmarshalNode(node.childForFieldName("name")!, ctx, id);
    n.number = unmarshalNode(node.childForFieldName("number")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("name")!.id,
            node.childForFieldName("number")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerLabelReferenceNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<LabelReferenceNode> = {
        id,
        parentId,
        type: "label_reference",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.names = unmarshalNode(node.childForFieldName("names")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("command")!.id, node.childForFieldName("names")!.id].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerLabelReferenceRangeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<LabelReferenceRangeNode> = {
        id,
        parentId,
        type: "label_reference_range",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.from = unmarshalNode(node.childForFieldName("from")!, ctx, id);
    n.to = unmarshalNode(node.childForFieldName("to")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("from")!.id,
            node.childForFieldName("to")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerLatexIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<LatexIncludeNode> = {
        id,
        parentId,
        type: "latex_include",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.path = unmarshalNode(node.childForFieldName("path")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("command")!.id, node.childForFieldName("path")!.id].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerLetCommandDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<LetCommandDefinitionNode> = {
        id,
        parentId,
        type: "let_command_definition",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.declaration = unmarshalNode(node.childForFieldName("declaration")!, ctx, id);
    n.implementation = unmarshalNode(node.childForFieldName("implementation")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            node.childForFieldName("declaration")!.id,
            node.childForFieldName("implementation")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerListingEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<ListingEnvironmentNode> = {
        id,
        parentId,
        type: "listing_environment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.begin = unmarshalNode(node.childForFieldName("begin")!, ctx, id);
    n.code = unmarshalNode(node.childForFieldName("code")!, ctx, id);
    n.end = unmarshalNode(node.childForFieldName("end")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("begin")!.id,
            node.childForFieldName("code")!.id,
            node.childForFieldName("end")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerLuacodeEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<LuacodeEnvironmentNode> = {
        id,
        parentId,
        type: "luacode_environment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.begin = unmarshalNode(node.childForFieldName("begin")!, ctx, id);
    n.code = unmarshalNode(node.childForFieldName("code")!, ctx, id);
    n.end = unmarshalNode(node.childForFieldName("end")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("begin")!.id,
            node.childForFieldName("code")!.id,
            node.childForFieldName("end")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerMathDelimiterNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<MathDelimiterNode> = {
        id,
        parentId,
        type: "math_delimiter",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.left_command = unmarshalNode(node.childForFieldName("left_command")!, ctx, id);
    n.left_delimiter = unmarshalNode(node.childForFieldName("left_delimiter")!, ctx, id);
    n.right_command = unmarshalNode(node.childForFieldName("right_command")!, ctx, id);
    n.right_delimiter = unmarshalNode(node.childForFieldName("right_delimiter")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("left_command")!.id,
            node.childForFieldName("left_delimiter")!.id,
            node.childForFieldName("right_command")!.id,
            node.childForFieldName("right_delimiter")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerMathEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<MathEnvironmentNode> = {
        id,
        parentId,
        type: "math_environment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.begin = unmarshalNode(node.childForFieldName("begin")!, ctx, id);
    n.end = unmarshalNode(node.childForFieldName("end")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("begin")!.id, node.childForFieldName("end")!.id].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerMintedEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<MintedEnvironmentNode> = {
        id,
        parentId,
        type: "minted_environment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.begin = unmarshalNode(node.childForFieldName("begin")!, ctx, id);
    n.code = unmarshalNode(node.childForFieldName("code")!, ctx, id);
    n.end = unmarshalNode(node.childForFieldName("end")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("begin")!.id,
            node.childForFieldName("code")!.id,
            node.childForFieldName("end")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerNewCommandDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<NewCommandDefinitionNode> = {
        id,
        parentId,
        type: "new_command_definition",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    const argcNode = node.childForFieldName("argc");
    n.argc = argcNode ? unmarshalNode(argcNode, ctx, id) : undefined;
    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.declaration = unmarshalNode(node.childForFieldName("declaration")!, ctx, id);
    const defaultNode = node.childForFieldName("default");
    n.default = defaultNode ? unmarshalNode(defaultNode, ctx, id) : undefined;
    n.implementation = unmarshalNode(node.childForFieldName("implementation")!, ctx, id);
    const specNode = node.childForFieldName("spec");
    n.spec = specNode ? unmarshalNode(specNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            argcNode ? argcNode.id : undefined,
            node.childForFieldName("command")!.id,
            node.childForFieldName("declaration")!.id,
            defaultNode ? defaultNode.id : undefined,
            node.childForFieldName("implementation")!.id,
            specNode ? specNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerOldCommandDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<OldCommandDefinitionNode> = {
        id,
        parentId,
        type: "old_command_definition",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.declaration = unmarshalNode(node.childForFieldName("declaration")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("command")!.id, node.childForFieldName("declaration")!.id].filter(
            (id) => id !== undefined,
        ),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerOperatorNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<OperatorNode> = {
        id,
        parentId,
        type: "operator",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerPackageIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<PackageIncludeNode> = {
        id,
        parentId,
        type: "package_include",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const optionsNode = node.childForFieldName("options");
    n.options = optionsNode ? unmarshalNode(optionsNode, ctx, id) : undefined;
    n.paths = unmarshalNode(node.childForFieldName("paths")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            optionsNode ? optionsNode.id : undefined,
            node.childForFieldName("paths")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerPairedDelimiterDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<PairedDelimiterDefinitionNode> = {
        id,
        parentId,
        type: "paired_delimiter_definition",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    const argcNode = node.childForFieldName("argc");
    n.argc = argcNode ? unmarshalNode(argcNode, ctx, id) : undefined;
    const bodyNode = node.childForFieldName("body");
    n.body = bodyNode ? unmarshalNode(bodyNode, ctx, id) : undefined;
    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.declaration = unmarshalNode(node.childForFieldName("declaration")!, ctx, id);
    n.left = unmarshalNode(node.childForFieldName("left")!, ctx, id);
    n.right = unmarshalNode(node.childForFieldName("right")!, ctx, id);

    const fieldNodes = new Set(
        [
            argcNode ? argcNode.id : undefined,
            bodyNode ? bodyNode.id : undefined,
            node.childForFieldName("command")!.id,
            node.childForFieldName("declaration")!.id,
            node.childForFieldName("left")!.id,
            node.childForFieldName("right")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerParagraphNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<ParagraphNode> = {
        id,
        parentId,
        type: "paragraph",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const textNode = node.childForFieldName("text");
    n.text = textNode ? unmarshalNode(textNode, ctx, id) : undefined;
    const tocNode = node.childForFieldName("toc");
    n.toc = tocNode ? unmarshalNode(tocNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            textNode ? textNode.id : undefined,
            tocNode ? tocNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerPartNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<PartNode> = {
        id,
        parentId,
        type: "part",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const textNode = node.childForFieldName("text");
    n.text = textNode ? unmarshalNode(textNode, ctx, id) : undefined;
    const tocNode = node.childForFieldName("toc");
    n.toc = tocNode ? unmarshalNode(tocNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            textNode ? textNode.id : undefined,
            tocNode ? tocNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerPycodeEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<PycodeEnvironmentNode> = {
        id,
        parentId,
        type: "pycode_environment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.begin = unmarshalNode(node.childForFieldName("begin")!, ctx, id);
    n.code = unmarshalNode(node.childForFieldName("code")!, ctx, id);
    n.end = unmarshalNode(node.childForFieldName("end")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("begin")!.id,
            node.childForFieldName("code")!.id,
            node.childForFieldName("end")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerSageblockEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<SageblockEnvironmentNode> = {
        id,
        parentId,
        type: "sageblock_environment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.begin = unmarshalNode(node.childForFieldName("begin")!, ctx, id);
    n.code = unmarshalNode(node.childForFieldName("code")!, ctx, id);
    n.end = unmarshalNode(node.childForFieldName("end")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("begin")!.id,
            node.childForFieldName("code")!.id,
            node.childForFieldName("end")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerSagesilentEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<SagesilentEnvironmentNode> = {
        id,
        parentId,
        type: "sagesilent_environment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.begin = unmarshalNode(node.childForFieldName("begin")!, ctx, id);
    n.code = unmarshalNode(node.childForFieldName("code")!, ctx, id);
    n.end = unmarshalNode(node.childForFieldName("end")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("begin")!.id,
            node.childForFieldName("code")!.id,
            node.childForFieldName("end")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerSectionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<SectionNode> = {
        id,
        parentId,
        type: "section",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const textNode = node.childForFieldName("text");
    n.text = textNode ? unmarshalNode(textNode, ctx, id) : undefined;
    const tocNode = node.childForFieldName("toc");
    n.toc = tocNode ? unmarshalNode(tocNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            textNode ? textNode.id : undefined,
            tocNode ? tocNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerSourceFileNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<SourceFileNode> = {
        id,
        parentId,
        type: "source_file",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerSubparagraphNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<SubparagraphNode> = {
        id,
        parentId,
        type: "subparagraph",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const textNode = node.childForFieldName("text");
    n.text = textNode ? unmarshalNode(textNode, ctx, id) : undefined;
    const tocNode = node.childForFieldName("toc");
    n.toc = tocNode ? unmarshalNode(tocNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            textNode ? textNode.id : undefined,
            tocNode ? tocNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerSubscriptNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<SubscriptNode> = {
        id,
        parentId,
        type: "subscript",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.subscript = unmarshalNode(node.childForFieldName("subscript")!, ctx, id);

    const fieldNodes = new Set([node.childForFieldName("subscript")!.id].filter((id) => id !== undefined));
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerSubsectionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<SubsectionNode> = {
        id,
        parentId,
        type: "subsection",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const textNode = node.childForFieldName("text");
    n.text = textNode ? unmarshalNode(textNode, ctx, id) : undefined;
    const tocNode = node.childForFieldName("toc");
    n.toc = tocNode ? unmarshalNode(tocNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            textNode ? textNode.id : undefined,
            tocNode ? tocNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerSubsubsectionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<SubsubsectionNode> = {
        id,
        parentId,
        type: "subsubsection",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const textNode = node.childForFieldName("text");
    n.text = textNode ? unmarshalNode(textNode, ctx, id) : undefined;
    const tocNode = node.childForFieldName("toc");
    n.toc = tocNode ? unmarshalNode(tocNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            textNode ? textNode.id : undefined,
            tocNode ? tocNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerSuperscriptNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<SuperscriptNode> = {
        id,
        parentId,
        type: "superscript",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.superscript = unmarshalNode(node.childForFieldName("superscript")!, ctx, id);

    const fieldNodes = new Set([node.childForFieldName("superscript")!.id].filter((id) => id !== undefined));
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerSvgIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<SvgIncludeNode> = {
        id,
        parentId,
        type: "svg_include",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const optionsNode = node.childForFieldName("options");
    n.options = optionsNode ? unmarshalNode(optionsNode, ctx, id) : undefined;
    n.path = unmarshalNode(node.childForFieldName("path")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            optionsNode ? optionsNode.id : undefined,
            node.childForFieldName("path")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerTextNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<TextNode> = {
        id,
        parentId,
        type: "text",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.word = node.childrenForFieldName("word").map((n) => unmarshalNode(n, ctx, id));

    const fieldNodes = new Set(
        [...node.childrenForFieldName("word").map((n) => n.id)].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerTextModeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<TextModeNode> = {
        id,
        parentId,
        type: "text_mode",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.content = unmarshalNode(node.childForFieldName("content")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("command")!.id, node.childForFieldName("content")!.id].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerTheoremDefinitionNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<TheoremDefinitionNode> = {
        id,
        parentId,
        type: "theorem_definition",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const counterNode = node.childForFieldName("counter");
    n.counter = counterNode ? unmarshalNode(counterNode, ctx, id) : undefined;
    n.name = unmarshalNode(node.childForFieldName("name")!, ctx, id);
    const optionsNode = node.childForFieldName("options");
    n.options = optionsNode ? unmarshalNode(optionsNode, ctx, id) : undefined;
    const titleNode = node.childForFieldName("title");
    n.title = titleNode ? unmarshalNode(titleNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            counterNode ? counterNode.id : undefined,
            node.childForFieldName("name")!.id,
            optionsNode ? optionsNode.id : undefined,
            titleNode ? titleNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerTikzLibraryImportNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<TikzLibraryImportNode> = {
        id,
        parentId,
        type: "tikz_library_import",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.paths = unmarshalNode(node.childForFieldName("paths")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("command")!.id, node.childForFieldName("paths")!.id].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerTitleDeclarationNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<TitleDeclarationNode> = {
        id,
        parentId,
        type: "title_declaration",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const optionsNode = node.childForFieldName("options");
    n.options = optionsNode ? unmarshalNode(optionsNode, ctx, id) : undefined;
    n.text = unmarshalNode(node.childForFieldName("text")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("command")!.id,
            optionsNode ? optionsNode.id : undefined,
            node.childForFieldName("text")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerTodoNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<TodoNode> = {
        id,
        parentId,
        type: "todo",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.arg = unmarshalNode(node.childForFieldName("arg")!, ctx, id);
    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    const optionsNode = node.childForFieldName("options");
    n.options = optionsNode ? unmarshalNode(optionsNode, ctx, id) : undefined;

    const fieldNodes = new Set(
        [
            node.childForFieldName("arg")!.id,
            node.childForFieldName("command")!.id,
            optionsNode ? optionsNode.id : undefined,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerValueNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<ValueNode> = {
        id,
        parentId,
        type: "value",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerVerbatimEnvironmentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<VerbatimEnvironmentNode> = {
        id,
        parentId,
        type: "verbatim_environment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.begin = unmarshalNode(node.childForFieldName("begin")!, ctx, id);
    n.end = unmarshalNode(node.childForFieldName("end")!, ctx, id);
    n.verbatim = unmarshalNode(node.childForFieldName("verbatim")!, ctx, id);

    const fieldNodes = new Set(
        [
            node.childForFieldName("begin")!.id,
            node.childForFieldName("end")!.id,
            node.childForFieldName("verbatim")!.id,
        ].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerVerbatimIncludeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<VerbatimIncludeNode> = {
        id,
        parentId,
        type: "verbatim_include",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.command = unmarshalNode(node.childForFieldName("command")!, ctx, id);
    n.path = unmarshalNode(node.childForFieldName("path")!, ctx, id);

    const fieldNodes = new Set(
        [node.childForFieldName("command")!.id, node.childForFieldName("path")!.id].filter((id) => id !== undefined),
    );
    n.childrenIds = node.namedChildren.filter((n) => !fieldNodes.has(n.id)).map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerArgcNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<ArgcNode> = {
        id,
        parentId,
        type: "argc",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCommandNameNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CommandNameNode> = {
        id,
        parentId,
        type: "command_name",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerCommentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<CommentNode> = {
        id,
        parentId,
        type: "comment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerDelimiterNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<DelimiterNode> = {
        id,
        parentId,
        type: "delimiter",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerLabelNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<LabelNode> = {
        id,
        parentId,
        type: "label",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerLetterNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<LetterNode> = {
        id,
        parentId,
        type: "letter",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerLineCommentNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<LineCommentNode> = {
        id,
        parentId,
        type: "line_comment",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerPathNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<PathNode> = {
        id,
        parentId,
        type: "path",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerPlaceholderNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<PlaceholderNode> = {
        id,
        parentId,
        type: "placeholder",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerSourceCodeNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<SourceCodeNode> = {
        id,
        parentId,
        type: "source_code",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerTodoCommandNameNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<TodoCommandNameNode> = {
        id,
        parentId,
        type: "todo_command_name",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerUriNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<UriNode> = {
        id,
        parentId,
        type: "uri",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerValueLiteralNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<ValueLiteralNode> = {
        id,
        parentId,
        type: "value_literal",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
    return id;
}

function unmarshalerWordNode(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
    const id = v4();
    const n: Partial<WordNode> = {
        id,
        parentId,
        type: "word",
        text: node.text,
    };
    ctx.nodes.set(id, n as AstNode);

    n.childrenIds = node.namedChildren.map((n) => unmarshalNode(n, ctx, id));
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
            const n = {
                id,
                parentId,
                type: node.type as any,
                text: node.text,
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
