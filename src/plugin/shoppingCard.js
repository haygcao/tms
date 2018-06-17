
class ShoppingCard {
    constructor(Vue) {
        this._card = new Vue({
            data() {
                return {
                    items: []
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
    get emitter() {
        return this._card;
    }
    add(cardItem) {
        // let cardItem = {
        //     key: clazz.id,
        //     index: clazz,
        //     details: []
        // }
        this.items.push(cardItem);
        this.emitter.$emit('added', cardItem);
    }
    // addItemDetail(index, detail) {
    //     let item = this.items.find(v => v.index.id == index.id);
    //     item.details.push(detail);
    // }
    remove(cardItem) {
        let idx = this.items.findIndex(v => v.key == cardItem.key);
        let removed = this.items.splice(idx, 1);
        this.emitter.$emit('removed', removed);
    }
    // replace(clazz) {
    //     this.remove(clazz);
    //     this.add(clazz);
    // }

}
function plugin(Vue, options) {

    if (plugin.installed) {
        return;
    }

    options = options || {};

    Vue.ShoppingCard = new ShoppingCard(Vue, options)


    Object.defineProperties(Vue.prototype, {

        $shoppingCard: {
            get() {
                return Vue.ShoppingCard;
            }
        }

    });

}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}


export default plugin