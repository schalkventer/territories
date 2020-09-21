# 🗺 Territories
> A JSON catalogue of countries, cities and everything inbetween, as well as UI to consume the data

## Example

<ul>
	<li>
		<img src="https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/ad.svg" height="16">
		<span>Andorra</span>
		<ul>
			<li>
				<img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Escut_d%27Andorra_la_Vella.svg" height="16">
				<span>Andorra la Vella</span>
			</li>
			<li>
				<img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Escut_de_Canillo.svg" height="16">
				<span>Canillo</span>
			</li>
			<li>
				<img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Escut_d%27Encamp.svg" height="20">
				<span>Encamp</span>
			</li>
			<li>...</li>
		</ul>
	</li>
	<li>
		<img src="https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/ae.svg" height="16">
		<span>United Arab Emirates</span>
		<ul><li>...</li></ul>
	<li>
		<img src="https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/af.svg" height="16">
		<span>Afghanistan</span>
		<ul><li>...</li></ul>
	</li>
	<li>...</li>
</ul>

## Data Structure

```
territories/
├── packages/
|   └── json/
│       ├── keys.json
│       ├── previews.json
│       ├── AD/
│       │   ├── data.json
│       │   ├── AD-07/
│       │   │   └── data.json
│       │   ├── AD-02/
│       │   │   └── data.json
│       │   ...
│       │   
│       ├── AE/
│       │   ├── keys.json
│       │   ├── AE-AZ/
│       │   │   └── data.json
│       │   ├── AE-AJ/
│       │   │   └── data.json
│       │   ...
│       │   
│       ├── AD/
│       │   ├── data.json
│       │   ├── AF-BDS/
│       │   │   └── data.json
│       │   ├── AF-BDG/
│       │   │   └── data.json
│       │   ...
│       ...   
...
```

The root `keys.json` file in the `data` folder contains an array of all country [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) codes, if you want to just get a list of all countries. 

For example: 

```json5
[
  "AD",
  "AE",
  "AF",
  // ...
]
```

However, you probably require a bit more than just the ISO 3166-2 key if you want to surface this information in your user interface. Luckily there is also a `previews.json` file with a bit more information. 

For example:

```json5
[
  {
    "key": "AD",
    "icon": "https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/ad.svg",
    "name": "Andorra",
    "link": "https://en.wikipedia.org//wiki/ISO_3166-2:AD"
  },
  {
    "key": "AE",
    "icon": "https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/ae.svg",
    "name": "United Arab Emirates",
    "link": "https://en.wikipedia.org//wiki/ISO_3166-2:AE"
  },
  {
    "key": "AF",
    "icon": "https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/af.svg",
    "name": "Afghanistan",
    "link": "https://en.wikipedia.org//wiki/ISO_3166-2:AF"
  },
  // ...
]
```

Each of the keys bove also has a namesake folder in the root `data` folder. Each of these have their own `keys.json` and `preview.json` files following the same structure. Note that _subdivision_ is the umbrella term used by the ISO 3166-2 for the highest territorial unit under country. This can be states, provinces, districts, prefectures, _et al._

For example [AD/keys.json](https://github.com/schalkventer/territories/blob/master/packages/json/AD/keys.json): 

```json5
[
  "AD-07",
  "AE-02",
  "AF-03",
  // ...
]
```

And also [AD/previews.json](https://github.com/schalkventer/territories/blob/master/packages/json/AD/previews.json):

```json5
[
  {
    "key": "AD-07",
    "name": "Andorra la Vella",
    "icon": "https:////upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Escut_d%27Andorra_la_Vella.svg/23px-Escut_d%27Andorra_la_Vella.svg.png"
  },
  {
    "key": "AD-02",
    "name": "Canillo",
    "icon": "https:////upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Escut_de_Canillo.svg/23px-Escut_de_Canillo.svg.png"
  },
  {
    "key": "AD-03",
    "name": "Encamp",
    "icon": "https:////upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Escut_d%27Encamp.svg/23px-Escut_d%27Encamp.svg.png"
  },
  // ...
]
```

## Sources

Data is aggregated from several sources, most notably:
* [ISO 3166-2 data](https://en.wikipedia.org/wiki/ISO_3166-2) scraped directly from Wikipedia
* [Hampus Joakim Nilsson](https://github.com/hjnilsson)'s [country-flags](https://github.com/hjnilsson/country-flags) is used to get SVG icons for countries.
* Subdivision SVG icons are scraped straight from [Wikipedia](https://en.wikipedia.org/wiki/Main_Page).
* [UN/LOCODE data](https://en.wikipedia.org/wiki/UN/LOCODE) is intersected with the above to map cities to subdivisions.
* [UN/LOCODE data](https://en.wikipedia.org/wiki/UN/LOCODE) not mapped to a subdivisions is added to the `other` folder for a country.
