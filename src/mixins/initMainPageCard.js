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
                            link: 'http://localhost:5000/assets/6bf15c5b3b97b811c117908a2fcaf3fb', 
                            desc: 'coat jacket vest'
                        }, 
                        { 
                            name: 'tops', 
                            link: 'http://localhost:5000/assets/e03dd9791336c3f1a85f24e92431a521', 
                            desc: 'shirt sweater cardigan'
                        }, 
                        { 
                            name: 'bottoms', 
                            link: 'http://localhost:5000/assets/9f389d9d3f3bf8ca9c8ae60de0373635', 
                            desc: 'pants jeans shorts'
                        }, 
                        { 
                            name: 'shoes', 
                            link: 'http://localhost:5000/assets/95648a21a5adbf45191c6c666634b708', 
                            desc: 'shoes sneakers boots'
                        }, 
                        { 
                            name: 'sportswear', 
                            link: 'http://localhost:5000/assets/c9944af700ee04799f7109a9ea423f2f', 
                            desc: 'pants t-shirt workout jacket'
                        }, 
                        { 
                            name: 'hats', 
                            link: 'http://localhost:5000/assets/0edad300a039faa70f1510296b9e20d7', 
                            desc: 'cap panama winter hat' 
                        }
                    ]
                },
                { 
                    path: 'women', 
                    categories: [
                        { 
                            name: 'outerwear', 
                            link: 'http://localhost:5000/assets/3e5aa503d53e7a87799e097c6e7de32c', 
                            desc: 'coat jacket vest'
                        }, 
                        { 
                            name: 'tops', 
                            link: 'http://localhost:5000/assets/2f291f0ef343faff407786146f534a05', 
                            desc: 'shirt sweater blouse'
                        }, 
                        { 
                            name: 'bottoms', 
                            link: 'http://localhost:5000/assets/f076ff29d7f1285509b5df6ccdcc1130', 
                            desc: 'pants jeans shorts'
                        }, { 
                            name: 'shoes', 
                            link: 'http://localhost:5000/assets/0c097db7a41b429f0e391504048fcd8c', 
                            desc: 'shoes sneakers boots'
                        }, 
                        { 
                            name: 'sportswear', 
                            link: 'http://localhost:5000/assets/ccdf460a93360d2a6b7c9a0705e974d2', 
                            desc: 't-shirt leggings shorts'
                        }, 
                        { 
                            name: 'dresses', 
                            link: 'http://localhost:5000/assets/77d96cf0cdb6589965906b6e4302f268', 
                            desc: 'cocktail evening casual'
                        }
                    ]
                },
            ]
        }
    }
}
