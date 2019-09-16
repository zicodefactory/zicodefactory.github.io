new Vue({
	el: '#app',
	data: {
		currencies: {},
		from: 'USD',
		to: 'EUR',
		amount: 0,
		result: 0,
		loading: false
	},

	mounted() {
		this.getCurrencies();
	},
	computed: {
		formattedCurrencies() {
			return Object.values(this.currencies);
		},
		convertedResult() {
			return (Number(this.amount) * this.result).toFixed(2);
		},
		disabled() {
			return this.amount === 0 || !this.amount || this.loading;
		}
	},
	methods: {
		getCurrencies() {
			const currencies = localStorage.getItem('currencies');

			if (currencies) {
				this.currencies = JSON.parse(currencies);

				return;
			}
			axios
				.get(
					'https://free.currconv.com/api/v7/currencies?apiKey=7ba3d5f27709915aec14'
				)

				.then(response => {
					this.currencies = response.data.results;
					localStorage.setItem(
						'currencies',
						JSON.stringify(response.data.results)
					);
				});
		},
		convertCurrency() {
			const key = `${this.from}_${this.to}`;
			this.loading = true;
			axios
				.get(
					`https://free.currconv.com/api/v7/convert?q=${key}&apiKey=7ba3d5f27709915aec14`
				)
				.then(response => {
					this.loading = false;
					this.result = response.data.results[key].val;
				});
		}
	},
	watch: {
		from() {
			this.result = 0;
		},

		to() {
			this.result = 0;
		}
	}
});
