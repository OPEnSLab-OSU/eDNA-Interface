import cn from "classnames";
import { h } from "preact";
import { useDispatch } from "react-redux";

import { BasicTextField } from "Components/TextField";
import { StateConfigData } from "Components/TopLevelConfig/stateconfigsdata";

function capitalizeFirst(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

type StateConfigProps = {
	config: StateConfigData;
	colorIndex: number;
	disabled: boolean;
	register: any;
};

function StateConfig({ config, colorIndex, disabled, register }: StateConfigProps) {
	return (
		<div className="config">
			<h2 className={cn("headline", `background-accent-${colorIndex + 1}`)}>
				{config.name}
				<i className={cn("square", `background-accent-${colorIndex + 1}`)} />
			</h2>
			<div className="content">
				{config.properties.map((p) => (
					<BasicTextField
						key={p.name}
						title={p.name}
						name={config.name + capitalizeFirst(p.name)}
						register={register}
						helpertext={p.description}
						type={p.type}
						disabled={disabled}
					/>
				))}
			</div>
		</div>
	);
}

export { StateConfig };
