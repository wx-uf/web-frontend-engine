import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { TFrontendEngineFieldSchema } from "../../../components/frontend-engine";
import { SUBMIT_BUTTON_SCHEMA } from "../../common";

export default {
	title: "Form/Conditional Rendering/Rules/Strings",
	component: null,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Conditional Rendering for Strings</Title>
					<Description>These rendering rules are for `string` type only.</Description>
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		intro: { table: { disable: true } },
		field1: { table: { disable: true } },
		field2: { table: { disable: true } },
		"submit-button": { table: { disable: true } },
	},
} as Meta;

const Template: Story<Record<string, TFrontendEngineFieldSchema>> = (args) => (
	<FrontendEngine
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						...args,
						...SUBMIT_BUTTON_SCHEMA,
					},
				},
			},
		}}
	/>
);

export const MinCharacters = Template.bind({});
MinCharacters.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 has at least 5 characters",
	},
	field1: {
		label: "Field 1",
		uiType: "text-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { min: 5 }] }],
		validation: [{ required: true }],
	},
};

export const MaxCharacters = Template.bind({});
MaxCharacters.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 has at most 5 characters",
	},
	field1: {
		label: "Field 1",
		uiType: "text-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { max: 5 }] }],
		validation: [{ required: true }],
	},
};

export const Matches = Template.bind({});
Matches.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 starts with `hello`",
	},
	field1: {
		label: "Field 1",
		uiType: "text-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { matches: "/^(hello)/" }] }],
		validation: [{ required: true }],
	},
};

export const Email = Template.bind({});
Email.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 is a valid email",
	},
	field1: {
		label: "Field 1",
		uiType: "email-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { email: true }] }],
		validation: [{ required: true }],
	},
};

export const Url = Template.bind({});
Url.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 is a valid url",
	},
	field1: {
		label: "Field 1",
		uiType: "text-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { url: true }] }],
		validation: [{ required: true }],
	},
};

export const Uuid = Template.bind({});
Uuid.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 is a valid uuid",
	},
	field1: {
		label: "Field 1",
		uiType: "text-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { uuid: true }] }],
		validation: [{ required: true }],
	},
};
