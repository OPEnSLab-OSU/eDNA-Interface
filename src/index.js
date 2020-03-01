import { Fragment, h, render } from "preact";

import { Global, css } from "@emotion/core";

import { App } from "App";

import Showcase from "./Showcase.js";


const Reset = css`
	html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed, 
	figure, figcaption, footer, header, hgroup, 
	menu, nav, output, ruby, section, summary,
	time, mark, audio, video {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 100%;
		font: inherit;
		vertical-align: baseline;
	}
	/* HTML5 display-role reset for older browsers */
	article, aside, details, figcaption, figure, 
	footer, header, hgroup, menu, nav, section {
		display: block;
	}
	body {
		line-height: 1;
	}
	ol, ul {
		list-style: none;
	}
	blockquote, q {
		quotes: none;
	}
	blockquote:before, blockquote:after,
	q:before, q:after {
		content: '';
		content: none;
	}
	table {
		border-collapse: collapse;
		border-spacing: 0;
	}
`;

const Base = css`
	* {
		box-sizing: border-box;
		font-family: Roboto, Verdana !important;
		padding: 0;
	}

	body {
		background: rgba(0,0,0,0.1);
	}

	html {
		font-size: 10px !important;
	}

	button {
		cursor: pointer;
		border: none;
		box-shadow: none;
	}

	input {
		border: none;
	}

	.clickable {
		cursor: pointer;
		-webkit-user-select: none; 
		-moz-user-select: none;
		-ms-user-select: none; 
		user-select: none;
	}

	.card {
		background: white;
		box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.1);
		border-radius: 4px;
	}
`;

render((<Fragment><App /></Fragment>), document.body);

// render((<Fragment><Global styles={Base} /><Showcase /></Fragment>), document.body);