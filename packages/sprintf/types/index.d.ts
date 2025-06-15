type Specifiers = {
	s: string;
	d: number;
	f: number;
};
type S = keyof Specifiers;

type BuildTuple<L extends number, T extends any[] = []> = T['length'] extends L
	? T
	: BuildTuple<L, [any, ...T]>;

type Subtract1<N extends number> = BuildTuple<N> extends [any, ...infer Rest]
	? Rest['length']
	: never;

type StripEscapedPercents<T extends string> =
	T extends `${infer Head}%%${infer Tail}`
		? `${Head}${StripEscapedPercents<Tail>}`
		: T;

type HasNamedPlaceholders<T extends string> =
	StripEscapedPercents<T> extends `${any}%(${string})${S}${string}`
		? true
		: false;

type HasPositionalPlaceholders<T extends string> =
	StripEscapedPercents<T> extends `${any}%${number}$${S}${string}`
		? true
		: false;

type HasUnnamedPlaceholders<T extends string> =
	StripEscapedPercents<T> extends `${any}%${S}${string}` ? true : false;

type HasDynamicPrecisionPlaceholders<T extends string> =
	StripEscapedPercents<T> extends `${any}%.*${S}${any}` ? true : false;

type HasStaticPrecisionPlaceholders<T extends string> =
	StripEscapedPercents<T> extends `${any}%.${number}${S}${any}` ? true : false;

type ExtractNamedPlaceholders<T extends string> =
	StripEscapedPercents<T> extends `${any}%(${infer Key})${infer Spec}${infer Rest}`
		? Spec extends S
			? { [K in Key]: Specifiers[Spec] } & ExtractNamedPlaceholders<Rest>
			: never
		: {};

type ExtractPositionalPlaceholders<T extends string> =
	StripEscapedPercents<T> extends `${any}%${infer Index extends number}$${infer Spec}${infer Rest}`
		? Spec extends S
			? {
					[K in Subtract1<Index>]: Specifiers[Spec];
			  } & ExtractPositionalPlaceholders<Rest>
			: ExtractPositionalPlaceholders<Rest>
		:  unknown[];

type ExtractStaticPrecisionPlaceholders<T extends string> =
	StripEscapedPercents<T> extends `${any}%.${infer Precision extends number}${infer Spec}${infer Rest}`
		? Spec extends S
			? [Specifiers[Spec], ...ExtractStaticPrecisionPlaceholders<Rest>]
			: never
		: [];

type ExtractDynamicPrecisionPlaceholder<T extends string> =
	StripEscapedPercents<T> extends `${any}%.*${infer Spec}${infer Rest}`
		? Spec extends S
			? [number, Specifiers[Spec], ...ExtractDynamicPrecisionPlaceholder<Rest>]
			: never
		: [];

type ExtractUnnamedPlaceholders<T extends string> =
	StripEscapedPercents<T> extends `${any}%${infer Spec}${infer Rest}`
		? Spec extends S
			? [Specifiers[Spec], ...ExtractUnnamedPlaceholders<Rest>]
			: never
		: [];

export type SprintfArgs<T extends string> = HasNamedPlaceholders<T> extends true
	? [values: ExtractNamedPlaceholders<T>]
	: HasDynamicPrecisionPlaceholders<T> extends true
	? ExtractDynamicPrecisionPlaceholder<T>
	: HasStaticPrecisionPlaceholders<T> extends true
	? ExtractStaticPrecisionPlaceholders<T>
	: HasPositionalPlaceholders<T> extends true
	? ExtractPositionalPlaceholders<T>
	: HasUnnamedPlaceholders<T> extends true
	? ExtractUnnamedPlaceholders<T>
	: [];
