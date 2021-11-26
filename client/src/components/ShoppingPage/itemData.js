import defaultBanner from '../../images/defaultbanner.jpg'

// Banner Effects
import beFire from '../../images/bannerEffects/fire.png'
import beFlowers from '../../images/bannerEffects/flowers.png'
import beLights from '../../images/bannerEffects/lights.png'
import beNeon from '../../images/bannerEffects/neon.png'

// Icon Effects
import ieGold from '../../images/iconEffects/gold.png'

// Backgrounds
import bgRoad from '../../images/backgrounds/road.jpg'
import bgGlittering from '../../images/backgrounds/glittering.jpg'
import bgStars from '../../images/backgrounds/stars.jpg'
import bgPlants from '../../images/backgrounds/plants.jpg'
import bgAbstract from '../../images/backgrounds/abstract.jpg'

export const bannerEffects =
    {
        items: [
            {
                type: "bannerEffect",
                name: "Fire",
                template: defaultBanner,
                item: beFire,
                price: 500
            },
            {
                type: "bannerEffect",
                name: "Flowers",
                template: defaultBanner,
                item: beFlowers,
                price: 500
            },
            {
                type: "bannerEffect",
                name: "Lights",
                template: defaultBanner,
                item: beLights,
                price: 500
            },
            {
                type: "bannerEffect",
                name: "Neon",
                template: defaultBanner,
                item: beNeon,
                price: 500
            },
        ]
    }

export const iconEffects =
{
    items: [
        {
            type: "iconEffect",
            name: "Gold",
            template: defaultBanner,
            item: ieGold,
            price: 1000
        }
    ]
}

export const backgrounds =
    {
        items: [
            {
                type: "background",
                name: "Road",
                template: null,
                item: bgRoad,
                price: 200
            },
            {
                type: "background",
                name: "Glittering",
                template: null,
                item: bgGlittering,
                price: 200
            },
            {
                type: "background",
                name: "Stars",
                template: null,
                item: bgStars,
                price: 200
            },
            {
                type: "background",
                name: "Plants",
                template: null,
                item: bgPlants,
                price: 200
            },
            {
                type: "background",
                name: "Abstract",
                template: null,
                item: bgAbstract,
                price: 200
            },
        ]
    }

export const weeklySpecials =
    {
        items: [
            {
                type: "background",
                name: "Glittering",
                template: null,
                item: bgGlittering,
                price: 100
            },
            {
                type: "background",
                name: "Road",
                template: null,
                item: bgRoad,
                price: 100
            }
        ]
    }