// Auto-generated from node-types.json

export interface AcronymDefinitionNode {
  type: 'acronym_definition';
  text: string;
  command: any;
  long: CurlyGroupNode;
  name: CurlyGroupTextNode;
  options?: BrackGroupKeyValueNode;
  short: CurlyGroupNode;
}

export interface AcronymReferenceNode {
  type: 'acronym_reference';
  text: string;
  command: any;
  name: CurlyGroupTextNode;
  options?: BrackGroupKeyValueNode;
}

export interface AsyEnvironmentNode {
  type: 'asy_environment';
  text: string;
  begin: BeginNode;
  code: SourceCodeNode;
  end: EndNode;
}

export interface AsydefEnvironmentNode {
  type: 'asydef_environment';
  text: string;
  begin: BeginNode;
  code: SourceCodeNode;
  end: EndNode;
}

export interface AuthorNode {
  type: 'author';
  text: string;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnvironmentDefinitionNode | GenericCommandNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | MathDelimiterNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimIncludeNode)[];
}

export interface AuthorDeclarationNode {
  type: 'author_declaration';
  text: string;
  authors: CurlyGroupAuthorListNode;
  command: any;
  options?: BrackGroupNode;
}

export interface BeginNode {
  type: 'begin';
  text: string;
  command: any;
  language?: CurlyGroupTextNode;
  name: CurlyGroupTextNode;
  options?: BrackGroupNode | BrackGroupKeyValueNode;
}

export interface BiblatexIncludeNode {
  type: 'biblatex_include';
  text: string;
  glob: CurlyGroupGlobPatternNode;
  options?: BrackGroupKeyValueNode;
}

export interface BibstyleIncludeNode {
  type: 'bibstyle_include';
  text: string;
  command: any;
  path: CurlyGroupPathNode;
}

export interface BibtexIncludeNode {
  type: 'bibtex_include';
  text: string;
  command: any;
  paths: CurlyGroupPathListNode;
}

export interface BlockCommentNode {
  type: 'block_comment';
  text: string;
  begin: any;
  comment?: CommentNode;
  end?: any;
}

export interface BrackGroupNode {
  type: 'brack_group';
  text: string;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | BrackGroupNode | CaptionNode | ChangesReplacedNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface BrackGroupArgcNode {
  type: 'brack_group_argc';
  text: string;
  value: ArgcNode;
}

export interface BrackGroupKeyValueNode {
  type: 'brack_group_key_value';
  text: string;
  pair?: KeyValuePairNode[];
}

export interface BrackGroupTextNode {
  type: 'brack_group_text';
  text: string | TextNode;
}

export interface BrackGroupWordNode {
  type: 'brack_group_word';
  text: string;
  word: WordNode;
}

export interface CaptionNode {
  type: 'caption';
  text: string;
  command: any;
  long: CurlyGroupNode;
  short?: BrackGroupNode;
}

export interface ChangesReplacedNode {
  type: 'changes_replaced';
  text: string;
  command: any;
  text_added: CurlyGroupNode;
  text_deleted: CurlyGroupNode;
}

export interface ChapterNode {
  type: 'chapter';
  text: string | CurlyGroupNode;
  command: any;
  toc?: BrackGroupNode;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnumItemNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | ParagraphNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SectionNode | SubparagraphNode | SubsectionNode | SubsubsectionNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface CitationNode {
  type: 'citation';
  text: string;
  command: any;
  keys: CurlyGroupTextListNode;
  postnote?: BrackGroupNode;
  prenote?: BrackGroupNode;
}

export interface ClassIncludeNode {
  type: 'class_include';
  text: string;
  command: any;
  options?: BrackGroupKeyValueNode;
  path: CurlyGroupPathNode;
}

export interface ColorDefinitionNode {
  type: 'color_definition';
  text: string;
  command: any;
  model: CurlyGroupTextNode;
  name: CurlyGroupTextNode;
  spec: CurlyGroupNode;
  children: BrackGroupTextNode[];
}

export interface ColorReferenceNode {
  type: 'color_reference';
  text: string | CurlyGroupNode;
  command: any;
  model?: BrackGroupTextNode;
  name?: CurlyGroupTextNode;
  spec?: CurlyGroupNode;
}

export interface ColorSetDefinitionNode {
  type: 'color_set_definition';
  text: string;
  command: any;
  head: CurlyGroupNode;
  model: CurlyGroupTextListNode;
  spec: CurlyGroupNode;
  tail: CurlyGroupNode;
  ty?: BrackGroupTextNode;
}

export interface CommentEnvironmentNode {
  type: 'comment_environment';
  text: string;
  begin: BeginNode;
  comment: CommentNode;
  end: EndNode;
}

export interface CounterAdditionNode {
  type: 'counter_addition';
  text: string;
  command: any;
  counter: CurlyGroupWordNode;
  value: (CounterValueNode | CurlyGroupValueNode)[];
}

export interface CounterDeclarationNode {
  type: 'counter_declaration';
  text: string;
  command: any;
  counter: CurlyGroupWordNode;
  supercounter?: BrackGroupWordNode;
}

export interface CounterDefinitionNode {
  type: 'counter_definition';
  text: string;
  command: any;
  counter: CurlyGroupWordNode;
  value: (CounterValueNode | CurlyGroupValueNode)[];
}

export interface CounterIncrementNode {
  type: 'counter_increment';
  text: string;
  command: any;
  counter: CurlyGroupWordNode;
}

export interface CounterTypesettingNode {
  type: 'counter_typesetting';
  text: string;
  command: any;
  counter: CurlyGroupWordNode;
}

export interface CounterValueNode {
  type: 'counter_value';
  text: string;
  command: any;
  counter: CurlyGroupWordNode;
}

export interface CounterWithinDeclarationNode {
  type: 'counter_within_declaration';
  text: string;
  command: any;
  counter: CurlyGroupWordNode;
  supercounter: CurlyGroupWordNode;
}

export interface CounterWithoutDeclarationNode {
  type: 'counter_without_declaration';
  text: string;
  command: any;
  counter: CurlyGroupWordNode;
  supercounter: CurlyGroupWordNode;
}

export interface CurlyGroupNode {
  type: 'curly_group';
  text: string;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | ChapterNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnumItemNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | ParagraphNode | PartNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SectionNode | SubparagraphNode | SubsectionNode | SubsubsectionNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface CurlyGroupAuthorListNode {
  type: 'curly_group_author_list';
  text: string;
  children: (AuthorNode | CommandNameNode)[];
}

export interface CurlyGroupCommandNameNode {
  type: 'curly_group_command_name';
  text: string;
  command: CommandNameNode;
}

export interface CurlyGroupGlobPatternNode {
  type: 'curly_group_glob_pattern';
  text: string;
  pattern: GlobPatternNode;
}

export interface CurlyGroupImplNode {
  type: 'curly_group_impl';
  text: string;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnvironmentDefinitionNode | GenericCommandNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | MathDelimiterNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimIncludeNode)[];
}

export interface CurlyGroupKeyValueNode {
  type: 'curly_group_key_value';
  text: string;
  pair?: KeyValuePairNode[];
}

export interface CurlyGroupLabelNode {
  type: 'curly_group_label';
  text: string;
  label: LabelNode;
}

export interface CurlyGroupLabelListNode {
  type: 'curly_group_label_list';
  text: string;
  label?: LabelNode[];
}

export interface CurlyGroupPathNode {
  type: 'curly_group_path';
  text: string;
  path: PathNode;
}

export interface CurlyGroupPathListNode {
  type: 'curly_group_path_list';
  text: string;
  path?: PathNode[];
}

export interface CurlyGroupSpecNode {
  type: 'curly_group_spec';
  text: string;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnvironmentDefinitionNode | GenericCommandNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | MathDelimiterNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimIncludeNode)[];
}

export interface CurlyGroupTextNode {
  type: 'curly_group_text';
  text: string | TextNode;
}

export interface CurlyGroupTextListNode {
  type: 'curly_group_text_list';
  text: string | TextNode[];
}

export interface CurlyGroupUriNode {
  type: 'curly_group_uri';
  text: string;
  uri: UriNode;
}

export interface CurlyGroupValueNode {
  type: 'curly_group_value';
  text: string;
  value: ValueLiteralNode;
}

export interface CurlyGroupWordNode {
  type: 'curly_group_word';
  text: string;
  word: WordNode;
}

export interface DisplayedEquationNode {
  type: 'displayed_equation';
  text: string;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | ChapterNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnumItemNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | ParagraphNode | PartNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SectionNode | SubparagraphNode | SubsectionNode | SubsubsectionNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface EndNode {
  type: 'end';
  text: string;
  command: any;
  name: CurlyGroupTextNode;
}

export interface EnumItemNode {
  type: 'enum_item';
  text: string;
  command: any;
  label?: BrackGroupTextNode;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface EnvironmentDefinitionNode {
  type: 'environment_definition';
  text: string;
  argc?: BrackGroupArgcNode;
  begin?: CurlyGroupImplNode;
  command: any;
  end?: CurlyGroupImplNode;
  name: CurlyGroupTextNode[];
  spec?: CurlyGroupSpecNode;
}

export interface GenericCommandNode {
  type: 'generic_command';
  text: string;
  arg?: CurlyGroupNode[];
  command: CommandNameNode;
}

export interface GenericEnvironmentNode {
  type: 'generic_environment';
  text: string;
  begin: BeginNode;
  end: EndNode;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | ChapterNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnumItemNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | ParagraphNode | PartNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SectionNode | SubparagraphNode | SubsectionNode | SubsubsectionNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface GlobPatternNode {
  type: 'glob_pattern';
  text: string;
}

export interface GlossaryEntryDefinitionNode {
  type: 'glossary_entry_definition';
  text: string;
  command: any;
  name: CurlyGroupTextNode;
  options: CurlyGroupKeyValueNode;
}

export interface GlossaryEntryReferenceNode {
  type: 'glossary_entry_reference';
  text: string;
  command: any;
  name: CurlyGroupTextNode;
  options?: BrackGroupKeyValueNode;
}

export interface GraphicsIncludeNode {
  type: 'graphics_include';
  text: string;
  command: any;
  options?: BrackGroupKeyValueNode;
  path: CurlyGroupPathNode;
}

export interface HyperlinkNode {
  type: 'hyperlink';
  text: string;
  command: any;
  label?: CurlyGroupNode;
  uri: CurlyGroupUriNode;
}

export interface ImportIncludeNode {
  type: 'import_include';
  text: string;
  command: any;
  directory: CurlyGroupPathNode;
  file: CurlyGroupPathNode;
}

export interface InkscapeIncludeNode {
  type: 'inkscape_include';
  text: string;
  command: any;
  options?: BrackGroupKeyValueNode;
  path: CurlyGroupPathNode;
}

export interface InlineFormulaNode {
  type: 'inline_formula';
  text: string;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | ChapterNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnumItemNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | ParagraphNode | PartNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SectionNode | SubparagraphNode | SubsectionNode | SubsubsectionNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface KeyValuePairNode {
  type: 'key_value_pair';
  text: string;
  key: TextNode;
  value?: ValueNode;
}

export interface LabelDefinitionNode {
  type: 'label_definition';
  text: string;
  command: any;
  name: CurlyGroupLabelNode;
}

export interface LabelNumberNode {
  type: 'label_number';
  text: string;
  command: any;
  name: CurlyGroupLabelNode;
  number: CurlyGroupNode;
}

export interface LabelReferenceNode {
  type: 'label_reference';
  text: string;
  command: any;
  names: CurlyGroupLabelListNode;
}

export interface LabelReferenceRangeNode {
  type: 'label_reference_range';
  text: string;
  command: any;
  from: CurlyGroupLabelNode;
  to: CurlyGroupLabelNode;
}

export interface LatexIncludeNode {
  type: 'latex_include';
  text: string;
  command: any;
  path: CurlyGroupPathNode;
}

export interface LetCommandDefinitionNode {
  type: 'let_command_definition';
  text: string;
  command: any;
  declaration: CommandNameNode;
  implementation: CommandNameNode;
}

export interface ListingEnvironmentNode {
  type: 'listing_environment';
  text: string;
  begin: BeginNode;
  code: SourceCodeNode;
  end: EndNode;
}

export interface LuacodeEnvironmentNode {
  type: 'luacode_environment';
  text: string;
  begin: BeginNode;
  code: SourceCodeNode;
  end: EndNode;
}

export interface MathDelimiterNode {
  type: 'math_delimiter';
  text: string;
  left_command: any;
  left_delimiter: CommandNameNode | WordNode;
  right_command: any;
  right_delimiter: CommandNameNode | WordNode;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | ChapterNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnumItemNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | ParagraphNode | PartNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SectionNode | SubparagraphNode | SubsectionNode | SubsubsectionNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface MathEnvironmentNode {
  type: 'math_environment';
  text: string;
  begin: BeginNode;
  end: EndNode;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface MintedEnvironmentNode {
  type: 'minted_environment';
  text: string;
  begin: BeginNode;
  code: SourceCodeNode;
  end: EndNode;
}

export interface NewCommandDefinitionNode {
  type: 'new_command_definition';
  text: string;
  argc?: BrackGroupArgcNode;
  command: any;
  declaration: CommandNameNode | CurlyGroupCommandNameNode;
  default?: BrackGroupNode;
  implementation: CurlyGroupNode | CurlyGroupCommandNameNode;
  spec?: CurlyGroupSpecNode;
}

export interface OldCommandDefinitionNode {
  type: 'old_command_definition';
  text: string;
  command: any;
  declaration: CommandNameNode;
}

export interface OperatorNode {
  type: 'operator';
  text: string;
}

export interface PackageIncludeNode {
  type: 'package_include';
  text: string;
  command: any;
  options?: BrackGroupKeyValueNode;
  paths: CurlyGroupPathListNode;
}

export interface PairedDelimiterDefinitionNode {
  type: 'paired_delimiter_definition';
  text: string;
  argc?: BrackGroupArgcNode;
  body?: CurlyGroupNode;
  command: any;
  declaration: CurlyGroupCommandNameNode;
  left: CommandNameNode | CurlyGroupImplNode;
  right: CommandNameNode | CurlyGroupImplNode;
}

export interface ParagraphNode {
  type: 'paragraph';
  text: string | CurlyGroupNode;
  command: any;
  toc?: BrackGroupNode;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnumItemNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SubparagraphNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface PartNode {
  type: 'part';
  text: string | CurlyGroupNode;
  command: any;
  toc?: BrackGroupNode;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | ChapterNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnumItemNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | ParagraphNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SectionNode | SubparagraphNode | SubsectionNode | SubsubsectionNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface PycodeEnvironmentNode {
  type: 'pycode_environment';
  text: string;
  begin: BeginNode;
  code: SourceCodeNode;
  end: EndNode;
}

export interface SageblockEnvironmentNode {
  type: 'sageblock_environment';
  text: string;
  begin: BeginNode;
  code: SourceCodeNode;
  end: EndNode;
}

export interface SagesilentEnvironmentNode {
  type: 'sagesilent_environment';
  text: string;
  begin: BeginNode;
  code: SourceCodeNode;
  end: EndNode;
}

export interface SectionNode {
  type: 'section';
  text: string | CurlyGroupNode;
  command: any;
  toc?: BrackGroupNode;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnumItemNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | ParagraphNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SubparagraphNode | SubsectionNode | SubsubsectionNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface SourceFileNode {
  type: 'source_file';
  text: string;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | ChapterNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnumItemNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | ParagraphNode | PartNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SectionNode | SubparagraphNode | SubsectionNode | SubsubsectionNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface SubparagraphNode {
  type: 'subparagraph';
  text: string | CurlyGroupNode;
  command: any;
  toc?: BrackGroupNode;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnumItemNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface SubscriptNode {
  type: 'subscript';
  text: string;
  subscript: CommandNameNode | CurlyGroupNode | LetterNode;
}

export interface SubsectionNode {
  type: 'subsection';
  text: string | CurlyGroupNode;
  command: any;
  toc?: BrackGroupNode;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnumItemNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | ParagraphNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SubparagraphNode | SubsubsectionNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface SubsubsectionNode {
  type: 'subsubsection';
  text: string | CurlyGroupNode;
  command: any;
  toc?: BrackGroupNode;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnumItemNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | ParagraphNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SubparagraphNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimEnvironmentNode | VerbatimIncludeNode)[];
}

export interface SuperscriptNode {
  type: 'superscript';
  text: string;
  superscript: CommandNameNode | CurlyGroupNode | LetterNode;
}

export interface SvgIncludeNode {
  type: 'svg_include';
  text: string;
  command: any;
  options?: BrackGroupKeyValueNode;
  path: CurlyGroupPathNode;
}

export interface TextNode {
  type: 'text';
  text: string;
  word: (AcronymDefinitionNode | AcronymReferenceNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | CaptionNode | ChangesReplacedNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | DelimiterNode | EnvironmentDefinitionNode | GenericCommandNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | NewCommandDefinitionNode | OldCommandDefinitionNode | OperatorNode | PackageIncludeNode | PairedDelimiterDefinitionNode | PlaceholderNode | SubscriptNode | SuperscriptNode | SvgIncludeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimIncludeNode | WordNode)[];
}

export interface TextModeNode {
  type: 'text_mode';
  text: string;
  command: any;
  content: CurlyGroupNode;
}

export interface TheoremDefinitionNode {
  type: 'theorem_definition';
  text: string;
  command: any;
  counter?: BrackGroupTextNode;
  name: CurlyGroupTextListNode;
  options?: BrackGroupKeyValueNode;
  title?: CurlyGroupNode;
}

export interface TikzLibraryImportNode {
  type: 'tikz_library_import';
  text: string;
  command: any;
  paths: CurlyGroupPathListNode;
}

export interface TitleDeclarationNode {
  type: 'title_declaration';
  text: string | CurlyGroupNode;
  command: any;
  options?: BrackGroupNode;
}

export interface TodoNode {
  type: 'todo';
  text: string;
  arg: CurlyGroupNode;
  command: TodoCommandNameNode;
  options?: BrackGroupNode;
}

export interface ValueNode {
  type: 'value';
  text: string;
  children: (AcronymDefinitionNode | AcronymReferenceNode | AuthorDeclarationNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | BrackGroupNode | CaptionNode | ChangesReplacedNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | DisplayedEquationNode | EnvironmentDefinitionNode | GenericCommandNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | MathDelimiterNode | NewCommandDefinitionNode | OldCommandDefinitionNode | PackageIncludeNode | PairedDelimiterDefinitionNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | VerbatimIncludeNode)[];
}

export interface VerbatimEnvironmentNode {
  type: 'verbatim_environment';
  text: string;
  begin: BeginNode;
  end: EndNode;
  verbatim: CommentNode;
}

export interface VerbatimIncludeNode {
  type: 'verbatim_include';
  text: string;
  command: any;
  path: CurlyGroupPathNode;
}

export interface ArgcNode {
  type: 'argc';
  text: string;
}

export interface CommandNameNode {
  type: 'command_name';
  text: string;
}

export interface CommentNode {
  type: 'comment';
  text: string;
}

export interface DelimiterNode {
  type: 'delimiter';
  text: string;
}

export interface LabelNode {
  type: 'label';
  text: string;
}

export interface LetterNode {
  type: 'letter';
  text: string;
}

export interface LineCommentNode {
  type: 'line_comment';
  text: string;
}

export interface PathNode {
  type: 'path';
  text: string;
}

export interface PlaceholderNode {
  type: 'placeholder';
  text: string;
}

export interface SourceCodeNode {
  type: 'source_code';
  text: string;
}

export interface TodoCommandNameNode {
  type: 'todo_command_name';
  text: string;
}

export interface UriNode {
  type: 'uri';
  text: string;
}

export interface ValueLiteralNode {
  type: 'value_literal';
  text: string;
}

export interface WordNode {
  type: 'word';
  text: string;
}

export type AstNode = AcronymDefinitionNode | AcronymReferenceNode | AsyEnvironmentNode | AsydefEnvironmentNode | AuthorNode | AuthorDeclarationNode | BeginNode | BiblatexIncludeNode | BibstyleIncludeNode | BibtexIncludeNode | BlockCommentNode | BrackGroupNode | BrackGroupArgcNode | BrackGroupKeyValueNode | BrackGroupTextNode | BrackGroupWordNode | CaptionNode | ChangesReplacedNode | ChapterNode | CitationNode | ClassIncludeNode | ColorDefinitionNode | ColorReferenceNode | ColorSetDefinitionNode | CommentEnvironmentNode | CounterAdditionNode | CounterDeclarationNode | CounterDefinitionNode | CounterIncrementNode | CounterTypesettingNode | CounterValueNode | CounterWithinDeclarationNode | CounterWithoutDeclarationNode | CurlyGroupNode | CurlyGroupAuthorListNode | CurlyGroupCommandNameNode | CurlyGroupGlobPatternNode | CurlyGroupImplNode | CurlyGroupKeyValueNode | CurlyGroupLabelNode | CurlyGroupLabelListNode | CurlyGroupPathNode | CurlyGroupPathListNode | CurlyGroupSpecNode | CurlyGroupTextNode | CurlyGroupTextListNode | CurlyGroupUriNode | CurlyGroupValueNode | CurlyGroupWordNode | DisplayedEquationNode | EndNode | EnumItemNode | EnvironmentDefinitionNode | GenericCommandNode | GenericEnvironmentNode | GlobPatternNode | GlossaryEntryDefinitionNode | GlossaryEntryReferenceNode | GraphicsIncludeNode | HyperlinkNode | ImportIncludeNode | InkscapeIncludeNode | InlineFormulaNode | KeyValuePairNode | LabelDefinitionNode | LabelNumberNode | LabelReferenceNode | LabelReferenceRangeNode | LatexIncludeNode | LetCommandDefinitionNode | ListingEnvironmentNode | LuacodeEnvironmentNode | MathDelimiterNode | MathEnvironmentNode | MintedEnvironmentNode | NewCommandDefinitionNode | OldCommandDefinitionNode | OperatorNode | PackageIncludeNode | PairedDelimiterDefinitionNode | ParagraphNode | PartNode | PycodeEnvironmentNode | SageblockEnvironmentNode | SagesilentEnvironmentNode | SectionNode | SourceFileNode | SubparagraphNode | SubscriptNode | SubsectionNode | SubsubsectionNode | SuperscriptNode | SvgIncludeNode | TextNode | TextModeNode | TheoremDefinitionNode | TikzLibraryImportNode | TitleDeclarationNode | TodoNode | ValueNode | VerbatimEnvironmentNode | VerbatimIncludeNode | ArgcNode | CommandNameNode | CommentNode | DelimiterNode | LabelNode | LetterNode | LineCommentNode | PathNode | PlaceholderNode | SourceCodeNode | TodoCommandNameNode | UriNode | ValueLiteralNode | WordNode;
