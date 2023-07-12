import men_outerwear from '@/assets/cards_men/outerwear.jpg'
import men_tops from '@/assets/cards_men/tops.jpg';
import men_bottoms from '@/assets/cards_men/bottoms.jpg';
import men_shoes from '@/assets/cards_men/shoes.jpg';
import men_sportswear from '@/assets/cards_men/sportswear.jpg';
import hats from '@/assets/cards_men/hats.jpg';
import women_outerwear from '@/assets/cards_women/outerwear.jpg';
import women_tops from '@/assets/cards_women/tops.jpg';
import women_bottoms from '@/assets/cards_women/bottoms.jpg';
import women_shoes from '@/assets/cards_women/shoes.jpg';
import women_sportswear from '@/assets/cards_women/sportswear.jpg';
import dresses from '@/assets/cards_women/dresses.jpg';

export default {
    data() {
        return {
            currentCategory: null,
            categories: [
                { 
                    path: 'men', 
                    categories: [
                        {
                            name: 'outerwear', 
                            img: men_outerwear, 
                            desc: 'coat jacket vest'
                        }, 
                        { 
                            name: 'tops', 
                            img: men_tops, 
                            desc: 'shirt sweater cardigan'
                        }, 
                        { 
                            name: 'bottoms', 
                            img: men_bottoms, 
                            desc: 'pants jeans shorts'
                        }, 
                        { 
                            name: 'shoes', 
                            img: men_shoes, 
                            desc: 'shoes sneakers boots'
                        }, 
                        { 
                            name: 'sportswear', 
                            img: men_sportswear, 
                            desc: 'pants t-shirt workout jacket'
                        }, 
                        { 
                            name: 'hats', 
                            img: hats, 
                            desc: 'cap panama winter hat' 
                        }
                    ]
                },
                { 
                    path: 'women', 
                    categories: [
                        { 
                            name: 'outerwear', 
                            img: women_outerwear, 
                            desc: 'coat jacket vest'
                        }, 
                        { 
                            name: 'tops', 
                            img: women_tops, 
                            desc: 'shirt sweater blouse'
                        }, 
                        { 
                            name: 'bottoms', 
                            img: women_bottoms, 
                            desc: 'pants jeans shorts'
                        }, { 
                            name: 'shoes', 
                            img: women_shoes, 
                            desc: 'shoes sneakers boots'
                        }, 
                        { 
                            name: 'sportswear', 
                            img: women_sportswear, 
                            desc: 't-shirt leggings shorts'
                        }, 
                        { 
                            name: 'dresses', 
                            img: dresses, 
                            desc: 'cocktail evening casual'
                        }
                    ]
                },
            ]
        }
    }
}
