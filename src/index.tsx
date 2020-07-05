import { Fragment, h, render } from "preact";
import { Provider } from "react-redux";

import { App } from "App";
import { store } from "App/redux/store";

const Application = (
	<Fragment>
		<Provider store={store}>
			<App />
		</Provider>
	</Fragment>
);

render(Application, document.body);
