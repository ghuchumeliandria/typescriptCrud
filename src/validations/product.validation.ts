import joi from "joi"

const productValSchema = joi.object({
    productName : joi.string().max(20).required().messages({
        "string.base" : "პროდუქტის სახელს ციფრი როგორ შეიძლება ერქვას?? სტრინგად ჩაწერ რომელიმეს და მოგხვდება",
        "string.max": 'რამხელა პროდუქტია რაარი? მაქსიმუმ 20 ასო',
        "any.required" : "შეავსე ველი , უსახელო პროდუქტი მეარგამიგია , შტერო"
    }),
    description : joi.string().min(6).required().messages({
        "string.base" : "ციფრით აღწერა მე არ გამიგია",
        "string.min" : "ასე მოკლე აღწერა პროდუქტს შეიძლება ჰქონდეს?",
        "any.required" : "შეავსეეე!"
    }),
    price : joi.number().required().messages({
        "number.base" : "აი ფასში სიტყვა რომელმა დებილმა ჩაწერე , სახელი შეგიძლია პროდუქტს დაარქვა რომ მივხვდე",
        "any.required" : "შეავსეეეე"
    }),
    category : joi.string().required().messages({
        "string.base" : "კატეგორია 3? მაგარი ხარ , ტექსტი შეიყვანე",
        "any.required" : "ბიჭო შეავსეთ ეს ველები ვააა"
    })
})

export default productValSchema