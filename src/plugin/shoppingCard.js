
function getExpiration(exp) {
    return exp ? Date.now() + exp : 0
}

function isExpired(exp) {
    return exp && (Date.now() > exp)
}
const cache = {}
class ShoppingCardItem {
    constructor({ category, index, product, quantity, details }) {
        this.index = index;
        this.key = index.id || '';
        this.category = category || 'clazz';
        this.product = product;
        this.quantity = quantity || 1;
        this.details = details;
        this.showDetail = false;
    }
}
class ShoppingCard {
    constructor(Vue, options) {
        this._card = new Vue({
            data() {
                return {
                    items: [],
                    student: undefined,
                }
            },
            computed: {
                amount() {
                    let amount = 0;
                    this.items.forEach(item => {
                        amount += item.quantity * parseFloat(item.product.price);
                    });

                    return amount;
                },
                quantity() {
                    return this.items.reduce((acc, cur) => {
                        return acc + cur.quantity;
                    }, 0);;
                }

            },
            beforeCreate() {
                this.$persist = (names, storeName = options.storeName, storeExpiration = options.expiration) => {
                    let read=options.read;
                    let write=options.write;
                    let clear=options.clear;
                    let store = cache[storeName] = JSON.parse(read(storeName) || '{}')
                    store.data = store.data || {}

                    if (isExpired(store.expiration)) {
                        clear(storeName)
                        store = {
                            data: {},
                            expiration: getExpiration(storeExpiration)
                        }
                    }

                    if (!store.expiration) {
                        store.expiration = getExpiration(storeExpiration)
                    }

                    this._persistWatchers = this._persistWatchers || []

                    for (const name of names) {
                        if (typeof store.data[name] !== 'undefined') {
                            this[name] = store.data[name]
                        }

                        if (this._persistWatchers.indexOf(name) === -1) {
                            this._persistWatchers.push(name)

                            this.$watch(name, val => {
                                store.data[name] = val
                                write(storeName, JSON.stringify(store))
                            }, { deep: true })
                        }
                    }
                }
            },
            persist: ['items', 'student'],
            created() {
                const { persist } = this.$options
                if (persist) {
                    this.$persist(persist)
                }
            }
        });
        this._card.$on('added', (goods) => {
            console.log('added clazz', goods)
        });
        this._card.$on('removed', (goods) => {
            console.log('removed clazz', goods)
        })
        this._card.$on('cleared', () => {
            console.log('card cleared')
        })
    }
    get items() {
        return this._card.items;
    }
    get amount() {
        return this._card.amount;
    }
    get quantity() {
        return this._card.quantity;
    }
    get student() {
        return this._card.student;
    }
    get emitter() {
        return this._card;
    }
    set student(value) {
        this._card.student = value;
    }
    package() {
        let pack = {};
        pack.amount = this.amount;
        pack.quantity = this.quantity;
        pack.items = JSON.parse(JSON.stringify(this.items));
        pack.student = JSON.parse(JSON.stringify(this.student));
        return pack;
    }
    clear() {
        this._card.items = [];
        this.student = undefined;
        this.emitter.$emit('clear');
    }
    add(cardItem) {
        // let cardItem = {
        //     key: clazz.id,
        //     index: clazz,
        //     product:{info:{subject,class_type,price},quantity:20}
        //     details: [{grade:'A1',terms:[{term:'1',course:{courseObject},available_lesson_count,$checked}]}]
        // }
        this.items.push(cardItem);
        this.emitter.$emit('added', cardItem);
    }
    remove(cardItem) {
        let idx = this.items.findIndex(v => v.key == cardItem.key);
        let removed = this.items.splice(idx, 1);
        this.emitter.$emit('removed', removed);
    }
    changeQuantityByYears(cardItem, year) {
        if (year == 0) {
            // let subject = this.items.find(v => v.key == cardItem.key);
            // subject[]
            cardItem.details[0][0].$checked = true;
        }
    }


}
const defaultOptions = {
    storeName: 'persist:shoppingcard-store',
    expiration: 1000 * 60 * 60 * 24,
    read: k => localStorage.getItem(k),
    write: (k, v) => localStorage.setItem(k, v),
    clear: k => localStorage.removeItem(k)
}
function plugin(Vue, options) {

    if (plugin.installed) {
        return;
    }

    options = Object.assign(defaultOptions, options);

    Vue.ShoppingCard = new ShoppingCard(Vue, options)
    Vue.ShoppingCardItem = ShoppingCardItem;

    Object.defineProperties(Vue.prototype, {

        $shoppingCard: {
            get() {
                return Vue.ShoppingCard;
            }
        },
        $shoppingCardItem: {
            get() {
                return Vue.ShoppingCardItem;
            }
        }

    });

}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}


export default plugin