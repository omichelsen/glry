import Blazy from 'blazy'
import { html, render } from 'lit-html'
import debounce from 'lodash/debounce'
import Taggle from 'taggle'
import { addTag, getTags, removeTag } from './api'

import imgZero from './img/0.png'
import imgLink from './img/hyperlink.svg'

const HOST = 'https://calvinhobbes.michelsen.dk'

const tplTagCloud = (tags) => html`
	<ul class="tagcloud">
		${tags.map((tag) => html`
			<li class="tag">
				<a href="#${encodeURIComponent(tag)}">${tag}</a>
			</li>
		`)}
	</ul>
`

const tplResultsCount = (count) => html`
	<div class="results-count">${count}</div>
`

const tplResults = (results) => html`
	<ol class="results">
		${results.map((r) => html`
			<li>
				<div class="result" id=${r.id} @click=${() => onResultClick(r)}>
					<img class="image" data-src=${fileFromId(r.id)} src=${imgZero} alt=${r.id}>
					<div class="tags" id="tags${r.id}"></div>
					<a class="permalink" href="/${hashFromId(r.id)}" target="_blank">
						<img src=${imgLink} alt="Permanent link to cartoon">
					</a>
				</div>
			</li>
		`)}
	</ol>
`

let elmSearch, elmRoot, elmSelected, elmSelectedTags
let bLazy, taggle

const fileFromId = (id) => `${HOST}/archive/${id.substr(0, 4)}/${id}.gif`

const hashFromId = (id) => `#${[id.substr(0, 4), id.substr(4, 2), id.substr(6, 2)].join('-')}`

const isNotDup = (tag) => !tag.match(/^\d{8}$/)

function clearElmChildren(elm) {
	while (elm.lastChild) {
		elm.removeChild(elm.lastChild)
	}
}

function clearSelected() {
	if (!elmSelected) return
	clearElmChildren(elmSelectedTags)
	elmSelected.classList.remove('selected')
	elmSelected = elmSelectedTags = undefined
}

function setSelected(elm) {
	elm.classList.add('selected')
	elm.scrollIntoView(true)
	elmSelected = elm
}

function onResultClick(dataItem) {
	const elm = document.getElementById(dataItem.id)
	if (!elm || elm.classList.contains('selected')) return

	clearSelected()
	setSelected(elm)

	elmSelectedTags = document.getElementById(`tags${dataItem.id}`)

	taggle = new Taggle(elmSelectedTags, {
		duplicateTagClass: 'bounce',
		tags: dataItem.tags,
		onTagAdd: (event, tag) => addTag(tag, dataItem),
		onTagRemove: (event, tag) => removeTag(tag, dataItem),
	})
}

function renderResults(results) {
	render(tplResults(results), elmRoot)
	setTimeout(() => bLazy.revalidate(), 100)
}

function renderTagCloud(data) {
	const tags = data.reduce((prev, curr) => (
		prev.concat(curr.tags.filter((tag) => (
			prev.indexOf(tag) === -1 && isNotDup(tag)
		)))
	), []).sort()

	render(tplTagCloud(tags), elmRoot)
}

const renderDebounced = debounce(renderResults, 700)

function search(query = '', data) {
	if (`${query}`.trim().length === 0) {
		renderTagCloud(data)
		return
	}

	if (isNotDup(query)) {
		data = data.filter((item) => item.tags.every(isNotDup))
	}

	const queryParts = query.toLowerCase().split(' ')

	const results = data.filter((item) => (
		queryParts.every((part) => (
			item.tags.concat([item.id]).some((tag) => tag.indexOf(part) > -1)
		))
	))

	render(tplResultsCount(results.length), elmRoot)
	renderDebounced(results)
}

const getQuery = () => decodeURIComponent(location.hash.replace('#', ''))

const navigate = (data) => {
	const query = getQuery()
	elmSearch.value = query
	search(query, data)
}

function bootstrap(data) {
	elmRoot = document.getElementById('root')
	elmSearch = document.getElementById('search')
	elmSearch.addEventListener('input', () => search(elmSearch.value, data))
	window.addEventListener('hashchange', () => navigate(data))
	bLazy = new Blazy({ selector: 'img' })
	navigate(data)
}

getTags().then(bootstrap)
