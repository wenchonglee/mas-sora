<script>
	// @ts-nocheck
	import * as Pancake from '@sveltejs/pancake';
	import dayjs from 'dayjs';

	/** @type {import('./$types').PageData} */
	export let data;

	const pct = (index) => (100 * index) / data.records.length;
</script>

<div class="chart">
	<Pancake.Chart x1={0} x2={data.records.length} y1={0} y2={8}>
		<Pancake.Grid horizontal count={5} let:value let:last>
			<div class="grid-line horizontal"><span>{value} {last ? '%' : ''}</span></div>
		</Pancake.Grid>

		<Pancake.Grid vertical count={10} let:value>
			<div class="grid-line vertical" />
			<span class="year-label">{dayjs(data.records[value].published_date).format('DD MMM YY')}</span
			>
		</Pancake.Grid>

		<Pancake.Svg>
			<Pancake.SvgLine data={data.records} x={(d) => d.index} y={(d) => d.sora} let:d>
				<path class="sora" {d} />
			</Pancake.SvgLine>

			<Pancake.SvgLine data={data.records} x={(d) => d.index} y={(d) => d.comp_sora_3m} let:d>
				<path class="sora3m" {d} />
			</Pancake.SvgLine>
		</Pancake.Svg>

		<Pancake.Point x={10} y={7}>
			<div class="text">
				<p class="bold">
					<span style="color: #ff3e00">—</span>
					<span>3M SORA</span>
					<span style="color: #495057">—</span>
					<span>SORA &nbsp;&nbsp;</span>
				</p>
				<br />
				<p>{dayjs(data.records[data.records.length - 1].published_date).format('DD MMM YYYY')}</p>
				<h2>3M SORA: {data.records[data.records.length - 1].comp_sora_3m.toFixed(2)}</h2>
				<h2>SORA: {data.records[data.records.length - 1].sora.toFixed(2)}</h2>
			</div>
		</Pancake.Point>

		<Pancake.Quadtree data={data.records} x={(d) => d.index} y={(d) => d.comp_sora_3m} let:closest>
			{#if closest}
				<Pancake.Point x={closest.index} y={closest.comp_sora_3m} let:d>
					<div class="focus" />
					<div
						class="tooltip"
						style="transform: translateX(-{pct(closest.index)}%) translateX(-80px)"
					>
						<span>{dayjs(closest.published_date).format('DD MMM YY')}</span>
						<strong>3M SORA: {closest.comp_sora_3m.toFixed(2)}</strong>
						<span>SORA: {closest.sora.toFixed(2)} <br /></span>
					</div>
				</Pancake.Point>
				<Pancake.Point x={closest.index} y={closest.sora} let:d>
					<div class="focus-sora" />
				</Pancake.Point>
			{/if}
		</Pancake.Quadtree>
	</Pancake.Chart>

	<table>
		<tr>
			<th> Date </th>
			<th> 3M SORA </th>
			<th> SORA </th>
		</tr>

		{#each data.records.slice(data.records.length - 7, data.records.length).reverse() as record}
			<tr>
				<td>{dayjs(record.published_date).format('DD MMM YY')}</td>
				<td>{record.comp_sora_3m.toFixed(2)}</td>
				<td>{record.sora.toFixed(2)}</td>
			</tr>
		{/each}
	</table>
</div>

<style>
	.chart {
		height: 450px;
		padding: 3em 0 2em 2em;
		margin: 0 0 36px 0;
		max-width: 80vw;
		margin: 0 auto;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
			'Apple Color Emoji', 'Segoe UI Emoji';
	}
	.grid-line {
		position: relative;
		display: block;
	}
	.grid-line.horizontal {
		width: calc(100% + 2em);
		left: -2em;
		border-bottom: 1px dashed #ccc;
	}
	.grid-line.vertical {
		height: 100%;
		border-left: 1px dashed #ccc;
	}
	.grid-line span {
		position: absolute;
		left: 0;
		bottom: 2px;
		line-height: 1;
		font-family: sans-serif;
		font-size: 14px;
		color: #999;
	}
	.year-label {
		position: absolute;
		left: -2ch;
		bottom: -50px;
		font-family: sans-serif;
		font-size: 14px;
		color: #999;
		text-align: center;
		width: 4ch;
	}
	strong {
		color: #fd7e14;
	}
	.text {
		position: absolute;
		width: max-content;
		color: #666;
		transform: translate(0, -50%);
		text-shadow: 0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white,
			0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white,
			0 0 8px white, 0 0 8px white;
		background: white;
	}
	.text p {
		margin: 0;
		line-height: 1.2;
		color: #999;
	}
	.text h2 {
		margin: 0;
		font-size: 1.4em;
	}
	path.sora {
		stroke: #495057;
		opacity: 0.5;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 1px;
		fill: none;
	}
	path.sora3m {
		stroke: #fd7e14;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2px;
		fill: none;
	}
	.focus {
		position: absolute;
		width: 8px;
		height: 8px;
		left: -5px;
		top: -5px;
		border: 4px solid #d9480f;
		border-radius: 50%;
		box-sizing: border-box;
	}
	.focus-sora {
		position: absolute;
		width: 8px;
		height: 8px;
		left: -5px;
		top: -5px;
		border: 4px solid #495057;
		border-radius: 50%;
		box-sizing: border-box;
	}
	.tooltip {
		position: absolute;
		white-space: nowrap;
		width: fit-content;
		backdrop-filter: blur(1px);
		bottom: 1em;
		/* background-color: white; */
		line-height: 1;
		text-shadow: 0 0 10px white, 0 0 10px white, 0 0 10px white, 0 0 10px white, 0 0 10px white,
			0 0 10px white, 0 0 10px white;
	}
	.tooltip strong {
		font-size: 1.4em;
		display: block;
	}
	p.bold {
		font-weight: 500;
	}
	table {
		margin: 0 auto;
		margin-top: 4rem;
	}
	table th {
		min-width: 100px;
		text-align: left;
	}
	@media (min-width: 800px) {
		.chart {
			height: 600px;
		}
		.year-label {
			left: -4ch;
			width: 9ch;
			bottom: -24px;
		}
		table {
			margin-top: 2rem;
		}
	}
</style>
