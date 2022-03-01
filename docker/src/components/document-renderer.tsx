import { h } from 'vue'
import type { ComponentOptions, DefineComponent, VNode } from 'vue'

type Node = Element | Text;

type Mark =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'superscript'
  | 'subscript'
  | 'keyboard';

export type Element = {
  children: Node[];
  [key: string]: unknown;
};

type Text = {
  text: string;
  [key: string]: unknown;
};

type Component<Props> = (props: Props) => JSX.Element | null;

type OnlyChildrenComponent = Component<{ children: VNode }> | keyof JSX.IntrinsicElements;

type MarkRenderers = { [Key in Mark]: OnlyChildrenComponent };

const relationship = (props: { relationship: string, data: { id: string; label: string | undefined; data: Record<string, any> | undefined } | null }) => {
    const { data } = props
    return <span>{data?.label || data?.id}</span>;
}

const paragraph = (props: { children: JSX.Element[], textAlign?: 'center' | 'end' }) => {
    const { children, textAlign } = props
    if (textAlign)
        return <p style={ 'text-align: ' + textAlign }>{ children }</p>;
    return <p>{ children }</p>;
}

const heading = (props: { level: 1 | 2 | 3 | 4 | 5 | 6, children: JSX.Element[], textAlign: 'center' | 'end' | undefined; }) => {
    const {level, textAlign, children} = props;
    const Heading = `h${level}` as 'h1';

    if (textAlign)
        return <Heading style={ 'text-align: ' + textAlign } v-slots={ children } />;
    return <Heading v-slots={ children } />;
}

const list = (props: { children: ComponentOptions[], type: 'ordered' | 'unordered' }) => {
    const {type, children} = props;
    const List = type === 'ordered' ? 'ol' : 'ul';
    return (
        <List>
        {children.map((x, i) => (
            <li key={i}>{h(x)}</li>
        ))}
        </List>
    );
}

const layout = (props: { children: ComponentOptions[], layout: [number, ...number[]] }) => {
    const { children, layout } = props;

    return (
        <div
            style={{
            display: 'grid',
            gridTemplateColumns: layout.map(x => `${x}fr`).join(' '),
            }}
        >
            {children.map((element, i) => (
            <div key={i}>{h(element)}</div>
            ))}
        </div>
    );
}

type linkComponent = DefineComponent<{
    children: JSX.Element,
    href: string
}>

type codeComponent = DefineComponent<{
    children: string
}>

interface Renderers {
  inline: {
    link: linkComponent | 'a';
    relationship: typeof relationship;
  } & MarkRenderers;
  block: {
    block: OnlyChildrenComponent;
    paragraph: typeof paragraph;
    blockquote: OnlyChildrenComponent;
    code: codeComponent | keyof JSX.IntrinsicElements;
    layout: typeof layout;
    divider: DefineComponent | keyof JSX.IntrinsicElements;
    heading: typeof heading;
    list: typeof list;
  };
}

export const defaultRenderers: Renderers = {
  inline: {
    bold: 'strong',
    code: 'code',
    keyboard: 'kbd',
    strikethrough: 's',
    italic: 'em',
    link: 'a',
    subscript: 'sub',
    superscript: 'sup',
    underline: 'u',
    relationship
  },
  block: {
    block: 'div',
    blockquote: 'blockquote',
    paragraph,
    divider: 'hr',
    heading,
    code: 'pre',
    list,
    layout,
  },
};

const DocumentNode = (props: { node: Element | Text, renderers: Renderers, componentBlocks: Record<string, ComponentOptions> }) => {
    const { node, renderers, componentBlocks } = props;

    if (typeof node.text === 'string') {
        
        let child: JSX.Element | null = null;

        if (node.text !== "")
            child = <>{node.text}</>;
        else
            child = <br/>
        
        (Object.keys(renderers.inline) as (keyof typeof renderers.inline)[]).forEach(markName => 
        {
            if (markName !== 'link' && markName !== 'relationship' && node[markName]) 
            {
                const Mark = renderers.inline[markName] as any;

                if (child)
                    child = <Mark>{child}</Mark>;
                else
                    child = <Mark />
            }
        });
        return child;
    }

    const local_node = node as Element;
    const children = local_node.children.map((x, i) => (
        <DocumentNode node={x} componentBlocks={componentBlocks} renderers={renderers} key={i} />
    ));
    switch (local_node.type as string) {
    case 'blockquote': {
        //@ts-ignore
        return <renderers.block.blockquote>{children}</renderers.block.blockquote>;
    }
    case 'paragraph': {
        return <renderers.block.paragraph textAlign={local_node.textAlign as "center" | "end" | undefined} children={children} />;
    }
    case 'code': {
        if (
            local_node.children.length === 1 &&
            local_node.children[0] &&
        typeof local_node.children[0].text === 'string'
        ) {//@ts-ignore
        return <renderers.block.code>{local_node.children[0].text}</renderers.block.code>;
        }
        break;
    }
    case 'layout': {
        return <renderers.block.layout layout={local_node.layout as any} children={children} />;
    }
    case 'divider': {
        //@ts-ignore
        return <renderers.block.divider />;
    }
    case 'heading': {
        return (
        <renderers.block.heading
            textAlign={local_node.textAlign as "center" | "end" | undefined}
            level={local_node.level as 1 | 2 | 3 | 4 | 5 | 6}
            children={children}
        />
        );
    }
    case 'component-block': {
        const Comp = componentBlocks[local_node.component as string];
        if (Comp) {
        const props = createComponentBlockProps(local_node, children);
        return (
            //@ts-ignore
            <div><Comp {...props} /></div>
        );
        }
        break;
    }
    case 'ordered-list':
    case 'unordered-list': {
        return (
        <renderers.block.list
            children={children}
            type={local_node.type === 'ordered-list' ? 'ordered' : 'unordered'}
        />
        );
    }
    case 'relationship': {
        const data = local_node.data as { id: string; label: string | undefined; data: Record<string, any> | undefined } | null;
        return (
        <renderers.inline.relationship
            relationship={local_node.relationship as string}
            data={data ? { id: data.id, label: data.label, data: data.data } : null}
        />
        );
    }
    case 'link': {
        return <renderers.inline.link href={local_node.href as string}>{children}</renderers.inline.link>;
    }
    }
    return <>{children}</>;
}

function set(obj: Record<string, any>, propPath: (string | number)[], value: any) {
  if (propPath.length === 1) {
    obj[propPath[0]] = value;
  } else {
    let firstElement = propPath.shift()!;
    set(obj[firstElement], propPath, value);
  }
}

function createComponentBlockProps(node: Element, children: JSX.Element[]) {
  const formProps = JSON.parse(JSON.stringify(node.props));
  node.children.forEach((child, i) => {
    if (child.propPath) {
      const propPath = [...(child.propPath as any)];
      set(formProps, propPath, children[i]);
    }
  });
  return formProps;
}

export type DocumentRendererProps<
  ComponentBlocks extends Record<string, ComponentOptions<any>> = Record<string, ComponentOptions<any>>
> = {
  document: Element[];
  renderers?: { inline?: Partial<Renderers['inline']>; block?: Partial<Renderers['block']> };
  componentBlocks?: ComponentBlocks;
};

export function GenericDocumentRenderer<ComponentBlocks extends Record<string, ComponentOptions<any>>> () {
    return (props: DocumentRendererProps<ComponentBlocks>) =>
    {
        const renderers = {
            inline: { ...defaultRenderers.inline, ...props.renderers?.inline },
            block: { ...defaultRenderers.block, ...props.renderers?.block },
        };
        const componentBlocks = props.componentBlocks || {};
        return (
            <>
                {
                props.document.map((x, i) => (
                <DocumentNode node={x} componentBlocks={componentBlocks} renderers={renderers} key={i} />
                ))}
            </>
        );
    }
}