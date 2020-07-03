import { Fragment, h, render } from "preact";
import { App } from "App";
import { Provider } from "react-redux";
import { store } from "App/redux/store";

// const Application = (
// 	<Fragment>
// 		<Provider store={store}>
// 			<App />
// 		</Provider>
// 	</Fragment>
// );

const Application = (
	<Fragment>
		<Provider store={store}>
			<App />
		</Provider>
	</Fragment>
);
render(Application, document.body);
