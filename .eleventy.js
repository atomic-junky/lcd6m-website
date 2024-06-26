const { DateTime } = require('luxon')
const markdownIt = require('markdown-it')
// const markdownItAnchor = require('markdown-it-anchor')
const EleventyPluginNavigation = require('@11ty/eleventy-navigation')
const EleventyPluginRss = require('@11ty/eleventy-plugin-rss')
const faviconsPlugin = require('eleventy-plugin-gen-favicons')
const { urlFor } = require('./src/_sanity/imageUrl.js')

require('dotenv').config()

/**
 * Eleventy configuration
 */
module.exports = function (eleventyConfig) {
	// Global data
	eleventyConfig.addGlobalData('baseUrl', process.env.CONFIG_BASE_URL)

	// Plugins
	eleventyConfig.addPlugin(EleventyPluginNavigation)
	eleventyConfig.addPlugin(EleventyPluginRss)

	// Template Formats
	eleventyConfig.setTemplateFormats([
		// Templates:
		'html',
		'njk',
		'md',
		// Static Assets:
		'ico',
		'css',
		'jpeg',
		'jpg',
		'png',
		'svg',
		'woff',
		'woff2',
		'ttf',
		'otf'
	])

	// Favicons Plugin
	eleventyConfig.addPlugin(faviconsPlugin, {
		manifestData: {
			name: 'La Confrérie D6 Maîtres',
			short_name: 'Lcd6m',
			theme_color: '#ffffff',
			background_color: '#ffffff',
			display: 'standalone'
		}
	})

	// Passthrough Copy
	eleventyConfig.addPassthroughCopy({
		'./public/': '/'
	})

	// BrowserSync Configuration
	eleventyConfig.setBrowserSyncConfig({ ghostMode: false })

	// Filters
	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		return DateTime.fromISO(dateObj, { zone: 'utc' })
			.setLocale('fr')
			.toLocaleString(DateTime.DATE_FULL)
	})

	eleventyConfig.addFilter('imageUrl', (assetObj) => {
		return urlFor(assetObj)
	})

	eleventyConfig.addFilter('toAbsoluteUrl', (url) => {
		const base = eleventyConfig.globalData.baseUrl

		if (url.startsWith('/')) url = url.slice(1)

		try {
			return new URL(url, base).href
		} catch (err) {
			console.error(err)
			return url
		}
	})

	// Markdown Configuration
	const markdownLibrary = markdownIt({
		html: true,
		breaks: true,
		linkify: true
	});
	eleventyConfig.setLibrary('md', markdownLibrary)

	// Eleventy Configuration
	return {
		templateFormats: ['md', 'njk', 'html', 'liquid'],
		htmlTemplateEngine: 'njk',
		dir: {
			input: 'src',
			includes: '_includes',
			data: '_data',
			output: '_site'
		}
	}
}
