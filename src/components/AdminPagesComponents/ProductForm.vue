<script>
import UploadedImg from '@/components/AdminPagesComponents/AddProductPageComponents/UploadedImg.vue';
export default {
    components: {
        UploadedImg
    },
    props: {
        editMode: {
            type: Boolean,
            default: false
        },
        editModeProduct: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            gender: null,
            title: 0,
            newTitle: false,
            product: {
                type: '',
                category: null,
                name: '',
                brand: '',
                description: '',
                properties: [],
                markers: [],
                materials: [],
                amount: [],
                color: [],
                value: null,
                isSale: {
                    flag: false,
                    oldValue: 0
                }
            },
            oldImages: null,
            images: null,
            formIsValid: false,
            rules: {
                productType: [
                    value => {
                        if (this.gender) return true;
                        return 'Product type is required';
                    }
                ],
                name: [
                    value => {
                        if (value.trim()) return true;
                        return 'Name is required';
                    }
                ],
                brand: [
                    value => {
                        if (value.trim()) return true;
                        return 'Brand is required';
                    }
                ],
                type: [
                    value => {
                        if (value.trim()) return true;
                        return 'Type is required';
                    }
                ],
                category: [
                    value => {
                        if (this.product.category) return true;
                        return 'Category is required';
                    }
                ],
                amount: {
                    size: [
                        value => {
                            if (value.trim()) return true;
                            return 'Size is empty';
                        }
                    ],
                    amount: [
                        value => {
                            if (value || value === 0) return true;
                            return 'Amount is empty';
                        }
                    ]
                },
                properties: [
                    value => {
                        if (value.trim()) return true;
                        return 'Property is empty';
                    }
                ],
                markers: [
                    value => {
                        if (value.length > 10) return 'Max marker length is 10';
                        if (value.trim()) return true;
                        return 'Marker is empty';
                    }
                ],
                materials: [
                    value => {
                        if (value.trim()) return true;
                        return 'Material is empty';
                    }
                ],
                colors: {
                    name: [
                        value => {
                            if (value.trim()) return true;
                            return 'Name is empty';
                        }
                    ],
                    rgb: [
                        value => {
                            if (value) return true;
                            return 'Choose a color';
                        }
                    ]
                },
                price: [
                    value => {
                        if (value) return true;
                        return 'Price is required';
                    }
                ],
                oldPrice: [
                    value => {
                        if (value) return true;
                        return 'Old price is required';
                    }
                ]
            }
        }
    },
    mounted() {
        if (this.editMode && this.editModeProduct) {
            this.gender = this.editModeProduct.article.slice(3, 4) === '1' ? 'men' : 'women';
            this.product.name = this.editModeProduct.name;
            this.product.brand = this.editModeProduct.brand;
            this.product.type = this.editModeProduct.type;
            this.product.category = this.editModeProduct.category;
            this.product.amount = this.editModeProduct.amount;
            this.product.description = this.editModeProduct.description;
            this.product.properties = this.editModeProduct.properties;
            this.product.markers = this.editModeProduct.markers;
            this.product.materials = this.editModeProduct.materials;
            const colorString = this.editModeProduct.color.value.split(', ');
            this.product.color = this.editModeProduct.color.rgb.map((rgb, index) => {
                return {
                    name: colorString[index],
                    rgb: this.rgbToHex(rgb)
                }
            });
            this.product.value = this.editModeProduct.value;
            if (this.editModeProduct.isSale.flag) {
                this.product.isSale.flag = true;
                this.product.isSale.oldValue = this.editModeProduct.isSale.oldValue;
            }
            this.oldImages = this.editModeProduct.images;
            this.title = this.editModeProduct.images.findIndex(img => img.title);
        }
    },
    methods: {
        addProp() {
            this.product.properties.push('');
        },
        removeProp(index) {
            this.product.properties.splice(index, 1);
        },
        addMarker() {
            this.product.markers.push('');
        },
        removeMarker(index) {
            this.product.markers.splice(index, 1);
        },
        addMaterial() {
            this.product.materials.push('');
        },
        removeMaterial(index) {
            this.product.materials.splice(index, 1);
        },
        addSize() {
            this.product.amount.push({ size: '', amount: 0 });
        },
        removeSize(index) {
            this.product.amount.splice(index, 1);
        },
        addColor() {
            this.product.color.push({ name: '', rgb: '#000000' });
        },
        removeColor(index) {
            this.product.color.splice(index, 1);
        },
        addSale() {
            if (!this.product.isSale.flag) {
                this.product.isSale.flag = true;
            } else {
                this.removeSale();
            }
        },
        removeSale() {
            this.product.isSale.flag = false;
            this.product.isSale.oldValue = 0;
        },
        setImages(e) {
            this.images = e.target.files;
        },
        removeImage(index) {
            let files = Array.from(this.images);
            if (files.length === 1) {
                this.images = null;
            } else {
                files.splice(index, 1);
                let newFileList = new DataTransfer();
                files.forEach(file => {
                    newFileList.items.add(file);
                });
                this.images = newFileList.files;
            }
        },
        removeOldImage(index) {
            this.oldImages.splice(index, 1);
        },
        titleChanged(value) {
            if (value || value === 0) {
                this.title = value;
            } else {
                this.title = 0;
            }
        },
        hexToRGB(hex) {
            const str = hex.replace("#", "");
            const r = parseInt(str.substring(0, 2), 16);
            const g = parseInt(str.substring(2, 4), 16);
            const b = parseInt(str.substring(4, 6), 16);
            return {
                r,
                g,
                b
            }
        },
        rgbToHex(rgb) {
            const rHex = rgb.r.toString(16).padStart(2, '0');
            const gHex = rgb.g.toString(16).padStart(2, '0');
            const bHex = rgb.b.toString(16).padStart(2, '0');
            const hex = '#' + rHex + gHex + bHex;
            return hex;
        },
        async validateForm() {
            const { valid } = await this.$refs.addProductForm.validate();
            this.formIsValid = valid;
        },
        async submitForm() {
            if (!this.product.amount.length) {
                this.addSize();
            }
            if (!this.product.color.length) {
                this.addColor();
            }
            await this.validateForm();
            if (this.formIsValid && this.images || this.editMode) {
                const names = this.product.color.map(color => color.name).join(', ');
                const colors = this.product.color.map(color => this.hexToRGB(color.rgb));
                if (this.editMode) {
                    this.$emit('editProduct', {
                        type: this.gender,
                        product: { 
                            ...this.product, 
                            color: { value: names, rgb: colors }, 
                            value: +this.product.value, 
                            isSale: {...this.product.isSale, oldValue: +this.product.isSale.oldValue},
                            article: this.editModeProduct.article
                        },
                        images: this.images ? this.images : [],
                        title: this.newTitle ? this.oldImages.length + this.title : this.title,
                        oldImages: this.oldImages,
                        newTitle: this.newTitle
                    });
                } else {
                    this.$emit('addProduct', {
                        type: this.gender,
                        product: { 
                            ...this.product, 
                            color: { value: names, rgb: colors }, 
                            value: +this.product.value 
                        },
                        images: this.images,
                        title: this.title
                    });
                }
            }
        }
    },
    watch: {
        gender() {
            if (this.gender === 'men' && this.product.category === 'dresses') {
                this.product.category = null;
            } else if (this.gender === 'women' && this.product.category === 'hats') {
                this.product.category = null;
            }
        },
    },
    computed: {
        uploadedImages() {
            if (this.images) {
                return Object.values(this.images).map(image => {
                    return URL.createObjectURL(image);
                })
            } else {
                return null;
            }
        },
        imgArrayLength() {
            return this.images ? Array.from(this.images).length : 0;
        }
    }
}
</script>
<template>
    <v-container class="addProduct-wrapper elevation-4 rounded-lg " fluid>
        <p class="addProduct-title text-button text-center pt-4">
            Add new product
        </p>
        <v-sheet color="background">
            <v-form ref="addProductForm" @submit.prevent="submitForm">
                <v-sheet class="ma-4 elevation-3 rounded-lg" color="background">
                    <p class="text-button text-center pt-2 font-weight-bold">
                        Product type
                    </p>
                    <v-sheet class="checkboxes-input-wrapper rounded-lg" color="background">
                        <v-checkbox 
                            v-model="gender" 
                            value="men" 
                            label="men" 
                            :rules="rules.productType"
                            :disabled="editMode" 
                            hide-details 
                        />
                        <v-checkbox 
                            v-model="gender" 
                            value="women" 
                            label="women" 
                            :rules="rules.productType"
                            :disabled="editMode" 
                            hide-details 
                        />
                    </v-sheet>
                </v-sheet>
                <v-text-field 
                    v-model="product.name" 
                    class="mx-4" 
                    label="Name" 
                    variant="solo" 
                    bg-color="background" 
                    density="compact"
                    :rules="rules.name"
                />
                <v-text-field 
                    v-model="product.brand" 
                    class="mx-4" 
                    label="Brand" 
                    variant="solo" 
                    bg-color="background" 
                    density="compact"
                    :rules="rules.brand"
                />
                <v-text-field 
                    v-model="product.type" 
                    class="mx-4" 
                    label="Type" 
                    variant="solo" 
                    bg-color="background" 
                    density="compact"
                    :rules="rules.type"
                />
                <v-sheet class="ma-4 elevation-3 rounded-lg" color="background">
                    <p class="text-button text-center pt-2 font-weight-bold">
                        Product category
                    </p>
                    <v-sheet class="categories-input-wrapper rounded-lg px-4" color="background">
                        <v-checkbox 
                            v-model="product.category" 
                            value="outerwear" 
                            label="outerwear" 
                            hide-details
                            :rules="rules.category" 
                        />
                        <v-checkbox 
                            v-model="product.category" 
                            value="tops" 
                            label="tops" 
                            hide-details
                            :rules="rules.category" 
                        />
                        <v-checkbox 
                            v-model="product.category" 
                            value="bottoms" 
                            label="bottoms" 
                            hide-details
                            :rules="rules.category" 
                        />
                        <v-checkbox 
                            v-model="product.category" 
                            value="shoes" 
                            label="shoes" 
                            hide-details
                            :rules="rules.category" 
                        />
                        <v-checkbox 
                            v-model="product.category" 
                            value="sportswear" 
                            label="sportswear" 
                            hide-details
                            :rules="rules.category" 
                        />
                        <v-checkbox 
                            v-if="!gender || gender === 'men'" 
                            v-model="product.category" 
                            value="hats" 
                            label="hats" 
                            hide-details
                            :rules="rules.category"
                        />
                        <v-checkbox 
                            v-if="gender === 'women'" 
                            v-model="product.category" 
                            value="dresses" 
                            label="dresses" 
                            hide-details
                            :rules="rules.category" 
                        />
                    </v-sheet>
                </v-sheet>
                <v-sheet class="ma-4 elevation-3 rounded-lg" color="background">
                    <p class="addProduct-input-title text-button text-center py-2 font-weight-bold">
                        Amount
                        <span class="add-btn text-caption" @click="addSize">
                            <u>Add</u> 
                            <v-icon class="add-btn-icon ml-1" icon="mdi-plus-circle-outline" size="small" />
                        </span>
                    </p>
                    <v-sheet v-for="(size, index) in product.amount" class="size-input rounded-lg" color="background">
                        <v-text-field
                            v-model="product.amount[index].size"
                            class="mx-2" 
                            label="Size" 
                            variant="solo" 
                            bg-color="background"
                            density="compact"
                            :rules="rules.amount.size"
                        />
                        <v-text-field
                            v-model="product.amount[index].amount"
                            type="number"
                            class="ml-2 mr-9" 
                            label="Amount" 
                            variant="solo" 
                            bg-color="background"
                            density="compact"
                            :rules="rules.amount.amount"
                        >
                            <button-ui 
                                class="remove-btn" 
                                :set="['t', 0, '2', 'mdi-close', 's']" 
                                @click="removeSize(index)"
                            />
                        </v-text-field>
                    </v-sheet>
                </v-sheet>
                <v-textarea 
                    v-model="product.description" 
                    class="mx-4" 
                    label="Description" 
                    variant="solo" 
                    density="compact" 
                    bg-color="background" 
                    auto-grow
                />
                <v-sheet class="ma-4 elevation-3 rounded-lg" color="background">
                    <p class="addProduct-input-title text-button text-center py-2 font-weight-bold">
                        Properties
                        <span class="add-btn text-caption" @click="addProp">
                            <u>Add</u> 
                            <v-icon class="add-btn-icon ml-1" icon="mdi-plus-circle-outline" size="small" />
                        </span>
                    </p>
                    <v-text-field 
                        v-for="(prop, index) in product.properties" 
                        v-model="product.properties[index]"
                        class="prop-input ml-4 mr-9"
                        variant="solo"
                        bg-color="background"
                        :label="`№${index + 1} property`"
                        density="compact"
                        :rules="rules.properties"
                    >
                        <button-ui 
                            class="remove-btn" 
                            :set="['t', 0, '2', 'mdi-close', 's']" 
                            @click="removeProp(index)"
                        />
                    </v-text-field>
                </v-sheet>
                <v-sheet class="ma-4 elevation-3 rounded-lg" color="background">
                    <p class="addProduct-input-title text-button text-center py-2 font-weight-bold">
                        Markers
                        <span class="add-btn text-caption" @click="addMarker">
                            <u>Add</u> 
                            <v-icon class="add-btn-icon ml-1" icon="mdi-plus-circle-outline" size="small" />
                        </span>
                    </p>
                    <v-text-field 
                        v-for="(marker, index) in product.markers" 
                        v-model="product.markers[index]"
                        class="prop-input ml-4 mr-9"
                        variant="solo"
                        bg-color="background"
                        :label="`№${index + 1} marker`"
                        density="compact"
                        :rules="rules.markers"
                    >
                        <button-ui 
                            class="remove-btn" 
                            :set="['t', 0, '2', 'mdi-close', 's']" 
                            @click="removeMarker(index)"
                        />
                    </v-text-field>
                </v-sheet>
                <v-sheet class="ma-4 elevation-3 rounded-lg" color="background">
                    <p class="addProduct-input-title text-button text-center py-2 font-weight-bold">
                        Materials
                        <span class="add-btn text-caption" @click="addMaterial">
                            <u>Add</u> 
                            <v-icon class="add-btn-icon ml-1" icon="mdi-plus-circle-outline" size="small" />
                        </span>
                    </p>
                    <v-text-field 
                        v-for="(material, index) in product.materials" 
                        v-model="product.materials[index]"
                        class="prop-input ml-4 mr-9"
                        variant="solo"
                        bg-color="background"
                        :label="`№${index + 1} material`"
                        density="compact"
                        :rules="rules.materials"
                    >
                        <button-ui 
                            class="remove-btn" 
                            :set="['t', 0, '2', 'mdi-close', 's']" 
                            @click="removeMaterial(index)"
                        />
                    </v-text-field>
                </v-sheet>
                <v-sheet class="ma-4 elevation-3 rounded-lg" color="background">
                    <p class="addProduct-input-title text-button text-center py-2 font-weight-bold">
                        Colors
                        <span class="add-btn text-caption" @click="addColor">
                            <u>Add</u> 
                            <v-icon class="add-btn-icon ml-1" icon="mdi-plus-circle-outline" size="small" />
                        </span>
                    </p>
                    <v-sheet v-for="(color, index) in product.color" class="color-input rounded-lg" color="background">
                        <v-text-field
                            v-model="product.color[index].name"
                            type="text"
                            class="mx-2" 
                            label="Name" 
                            variant="solo" 
                            bg-color="background"
                            density="compact"
                            :rules="rules.colors.name"
                        />
                        <v-text-field
                            v-model="product.color[index].rgb"
                            type="color"
                            class="ml-2 mr-9" 
                            label="RGB" 
                            variant="solo" 
                            bg-color="background"
                            density="compact"
                            :rules="rules.colors.rgb"
                        >
                            <button-ui 
                                class="remove-btn" 
                                :set="['t', 0, '2', 'mdi-close', 's']" 
                                @click="removeColor(index)"
                            />
                        </v-text-field>
                    </v-sheet>
                </v-sheet>
                <v-text-field 
                    v-model="product.value" 
                    class="mt-4 mx-4"
                    label="Price" 
                    density="compact" 
                    variant="solo" 
                    bg-color="background"
                    type="number"
                    :rules="rules.price"
                />
                <v-sheet color="background">
                    <p class="addProduct-input-title text-button text-center mx-4 py-2 font-weight-bold">
                        <span class="add-btn text-caption" @click="addSale">
                            <u>{{ product.isSale.flag ? 'Remove' : 'Add' }} discount</u> 
                            <v-icon class="add-btn-icon ml-1" :icon="product.isSale.flag ? 'mdi-minus-circle-outline' : 'mdi-plus-circle-outline'" size="small" />
                        </span>
                    </p>
                    <v-scale-transition>
                        <v-text-field 
                            v-if="product.isSale.flag"
                            v-model="product.isSale.oldValue"
                            class="mt-4 mx-4"
                            label="Old price"
                            density="compact"
                            variant="solo"
                            bg-color="background"
                            type="number"
                            :rules="rules.oldPrice"
                        />
                    </v-scale-transition>
                </v-sheet>
                <v-sheet 
                    v-if="editMode && editModeProduct && editModeProduct.images.length" 
                    class="ma-4 elevation-3 rounded-lg"
                    color="background"
                >
                    <p class="text-button text-center pt-2 font-weight-bold">
                        Current images
                    </p>
                    <v-sheet class="uploaded-imgs-wrapper" color="background">
                        <UploadedImg
                            v-for="(image, index) in editModeProduct.images"
                            :index="index" 
                            :image="`https://jsstore-backend.vercel.app/${image.path}`"
                            :title="title"
                            :imgArrayLength="oldImages ? oldImages.length : 1"
                            :newTitle="!newTitle"
                            :editMode="editMode"
                            :secondImgArrayLength="images ? images.length : 0"
                            @removeImage="removeOldImage(index)"
                            @titleChanged="titleChanged"
                        />
                    </v-sheet>
                </v-sheet>
                <v-checkbox
                    v-if="editMode"
                    v-model="newTitle"
                    class="mx-4" 
                    label="Set new product title" 
                    hide-details
                    :disabled="!images"
                />
                <v-sheet class="ma-4 elevation-3 rounded-lg" color="background">
                    <p class="text-button text-center pt-2 font-weight-bold">
                        Images
                    </p>
                    <label class="file-input-wrapper elevation-4 rounded-lg ma-2">
                        <p :class="`file-input-title rounded-lg text-button text-nowrap text-truncate ${!this.images ? 'animated-input' : ''}`">
                            Upload
                            <v-icon icon="mdi-cloud-upload-outline ml-1" size="large"/>
                        </p>
                        <v-text-field
                            :onchange="$event => setImages($event)"
                            class="mx-4" 
                            type="file" 
                            variant="outlined" 
                            bg-color="background"
                            density="compact"
                            accept=".png, .jpg, .jpeg"
                            multiple
                            hide-details
                        />
                    </label>
                    <v-sheet class="uploaded-imgs-wrapper pa-2 rounded-lg" color="background">
                        <UploadedImg 
                            v-for="(image, index) in uploadedImages" 
                            :index="index" 
                            :image="image"
                            :title="title"
                            :imgArrayLength="imgArrayLength"
                            :newTitle="newTitle"
                            :editMode="editMode"
                            :secondImgArrayLength="oldImages ? oldImages.length : 0"
                            @removeImage="removeImage(index)"
                            @titleChanged="titleChanged"
                        />
                    </v-sheet>
                </v-sheet>
                <p class="upload-error text-caption text-center pb-1">
                    <span class="upload-error-content" v-if="uploadedImages && uploadedImages.length > 10">
                        Image limit - 10
                    </span>
                </p>
                <v-btn type="submit" :disabled="uploadedImages && uploadedImages.length > 10">
                    {{ editMode ? 'Save' : 'Create' }}
                </v-btn>
            </v-form>
        </v-sheet>
    </v-container>
</template>
<style>
@keyframes animatedInput {
    0% {
        scale: 1;
    }
    50% {
        scale: 1.1;
    }
    100% {
        scale: 1;
    }
}
.animated-input {
    animation: animatedInput 0.8s linear 0s infinite;
}
.addProduct-wrapper {
    max-width: 900px;
}
.addProduct-title {
    font-size: 16px !important;
}
.checkboxes-input-wrapper {
    display: flex;
}
.checkboxes-input-wrapper .v-input {
    display: flex;
    justify-content: center;
}
.categories-input-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}
.prop-input {
    position: relative;
}
.remove-btn {
    position: absolute;
    left: calc(100% + 5px);
    top: 50%;
    transform: translateY(-50%);
}
.addProduct-input-title {
    position: relative;
}
.add-btn {
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: #2196F3;
}
.add-btn:hover {
    color: black;
}
.add-btn-icon {
    position: relative;
    bottom: 2px;
}
.size-input, .color-input {
    display: flex;
}
.uploaded-imgs-wrapper {
    display: grid;
    grid-row-gap: 30px;
    grid-template-columns: repeat(4, 1fr);
    padding-bottom: 25px !important;
}
input[type=file] {
    opacity: 0 !important;
}
.file-input-wrapper {
    position: relative;
    display: block;
    width: 200px;
    height: 46px;
    cursor: pointer;
    margin: 4px auto !important;
}
.file-input-title {
    position: absolute;
    top: 0;
    left:0;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background: black;
    transition: all 0.4s ease;
}
.file-input-title:hover {
    background: white;
    color: black;
}
.checkboxes-input-wrapper .v-input--error .v-icon,
.categories-input-wrapper .v-input--error .v-icon {
    color: #B00020;
}
.upload-error {
    color: #B00020;
    text-align: center !important;
    min-height: 24px !important;
}
.currentImg-delete-btn {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
}
.currentImg-title-checkbox {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
@media (min-height: 1286px) {
    .addProduct {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
@media (max-width: 800px) {
    .uploaded-imgs-wrapper {
        grid-template-columns: repeat(3, 1fr);
    }
}
@media (max-width: 650px) {
    .uploaded-imgs-wrapper {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (max-width: 400px) {
    .uploaded-imgs-wrapper {
        grid-template-columns: repeat(1, 1fr);
    }
}
@media (max-width: 450px) {
    .categories-input-wrapper {
        grid-template-columns: 1fr 1fr;
    }
}
@media (max-width: 310px) {
    .categories-input-wrapper {
        grid-template-columns: 1fr;
    }
}
</style>
