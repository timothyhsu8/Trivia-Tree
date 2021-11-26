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
        type: "bannerEffects",
        items: [
            {
                name: "Fire",
                template: defaultBanner,
                item: beFire,
                price: 500
            },
            {
                name: "Flowers",
                template: defaultBanner,
                item: beFlowers,
                price: 500
            },
            {
                name: "Lights",
                template: defaultBanner,
                item: beLights,
                price: 500
            },
            {
                name: "Neon",
                template: defaultBanner,
                item: beNeon,
                price: 500
            },
        ]
    }

export const iconEffects =
{
    type: "iconEffects",
    items: [
        {
            name: "Gold",
            template: defaultBanner,
            item: ieGold,
            price: 1000
        }
    ]
}

export const backgrounds =
    {
        type: "backgrounds",
        items: [
            {
                name: "Road",
                template: null,
                item: bgRoad,
                price: 200
            },
            {
                name: "Glittering",
                template: null,
                item: bgGlittering,
                price: 200
            },
            {
                name: "Stars",
                template: null,
                item: bgStars,
                price: 200
            },
            {
                name: "Plants",
                template: null,
                item: bgPlants,
                price: 200
            },
            {
                name: "Abstract",
                template: null,
                item: bgAbstract,
                price: 200
            },
        ]
    }

export const weeklySpecials =
    {
        type: "weeklySpecials",
        items: [
            {
                name: "Glittering",
                template: null,
                item: bgGlittering,
                price: 100
            },
            {
                name: "Road",
                template: null,
                item: bgRoad,
                price: 100
            }
        ]
    }