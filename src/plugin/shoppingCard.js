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
    constructor(Vue) {
        this._card = new Vue({
            data() {
                return {
                    items: [],
                    student: undefined,
                }
            },
            computed: {
                amount() {
                    let am = 0;
                    this.items.forEach(item => {
                        item.details.forEach(grade => {
                            grade.terms.forEach(term => {
                                if (term.course) {
                                    am += parseFloat(term.course.price);
                                }
                            })
                        });
                    });
                    return am;
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
    get student() {
        return this._card.student;
    }
    get emitter() {
        return this._card;
    }
    set student(value) {
        this._card.student = value;
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
    // addItemDetail(index, detail) {
    //     let item = this.items.find(v => v.index.id == index.id);
    //     item.details.push(detail);
    // }
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
function plugin(Vue, options) {

    if (plugin.installed) {
        return;
    }

    options = options || {};

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