import { v } from 'convex/values'

import { components } from './_generated/api'
import { mutation, type MutationCtx } from './_generated/server'

type SeedLinks = {
  facebook?: string
  instagram?: string
  tiktok?: string
  youtube?: string
  x?: string
}

const initialWoredas: Array<{
  number: number
  links: SeedLinks
}> = [
  { number: 1, links: {} },
  { number: 2, links: {} },
  {
    number: 3,
    links: {
      facebook: 'https://www.facebook.com/taphafaanoromoo',
      tiktok: 'https://www.tiktok.com/@akakikakitiyw3prospertip?_r=1&_t=ZS-99aZrkdH4Cd',
      x: 'https://x.com/prosperity_2012/status/1885100804907921710?t=QPvUwoDYLtNtcIFurVZ59A&s=19',
    },
  },
  {
    number: 4,
    links: {
      facebook: 'https://www.facebook.com/share/p/19STXCB3Mt/',
      youtube: 'https://youtube.com/@akakikalityworedatwelve?si=pepwm4fTthbLrgrL',
    },
  },
  { number: 5, links: { facebook: 'https://www.facebook.com/asefaw.mar' } },
  {
    number: 6,
    links: { facebook: 'https://www.facebook.com/profile.php?id=100084985077584' },
  },
  {
    number: 7,
    links: {
      facebook: 'https://www.facebook.com/mura.wudima.9',
      tiktok: 'https://vm.tiktok.com/ZS9SDwBLQRLcX-U7BCw/',
      x: 'https://x.com/akaki936/status/2080327808664912284',
    },
  },
  {
    number: 8,
    links: {
      facebook: 'https://www.facebook.com/akakikality.woreda.08',
      instagram: 'https://www.instagram.com/akw8101pp?stkn=dTZsNTB6Y3RvNnY1',
      tiktok: 'https://tiktok.com/@_pp_ak_w8_branch8',
      youtube: 'https://youtube.com/@akppw8branch?si=aHgRtGvirn3pocyu',
      x: 'https://x.com/Yonas5637379649',
    },
  },
  {
    number: 9,
    links: {
      facebook: 'https://www.facebook.com/getnet.andualem.18',
      tiktok: 'https://www.tiktok.com/@worknehtesfaye/photo/7680802746395692306',
    },
  },
  {
    number: 10,
    links: {
      facebook: 'https://www.facebook.com/share/p/17wM9xRq7b/',
      tiktok: 'https://www.tiktok.com/@mestawot.tadesse5?_r=1&_t=ZS-93zpJTydYE0',
      youtube: 'https://youtube.com/@werdatenppmediya?si=aP-tn0RTzsRQyWsC',
      x: 'https://x.com/ppmediya86138',
    },
  },
  {
    number: 12,
    links: {
      facebook: 'https://www.facebook.com/woreda.twelve',
      instagram: 'https://www.instagram.com/ak.kalityworedatwelvepro.party?stkn=OTQzYjVoenZ3dDB3',
      tiktok: 'https://www.tiktok.com/@prosperityakakikalityw12?_r=1&_t=ZS-99eC5QLGK3x',
      youtube: 'https://youtube.com/@akakikalityworedatwelve?si=BNX8bbR7RDWrXgug',
      x: 'https://x.com/akaki22905',
    },
  },
  {
    number: 13,
    links: {
      facebook: 'https://www.facebook.com/hana.labena.102',
      tiktok: 'https://vm.tiktok.com/ZS9S9NBwCgGes-XuYaA/',
      youtube: 'https://www.youtube.com/@ErmiMulugeta-f8u',
    },
  },
]

async function seedDirectory(
  ctx: MutationCtx,
  updatedBy: string,
) {
  const existingAreas = await ctx.db.query('areas').take(100)
  const now = Date.now()

  let city = existingAreas.find((area) => area.type === 'city')
  if (!city) {
    const cityId = await ctx.db.insert('areas', {
      type: 'city',
      name: 'Addis Ababa',
      displayOrder: 0,
      active: true,
      links: {
        facebook: 'https://www.facebook.com/profile.php?id=61578155890289',
        instagram: 'https://www.instagram.com/p/DdBP47JtIpM/?stkn=MWJqejQ4OGh3bHA5bg==',
      },
      updatedAt: now,
      updatedBy,
    })
    city = (await ctx.db.get(cityId)) ?? undefined
  }

  let subcity = existingAreas.find((area) => area.type === 'subcity')
  if (!subcity) {
    const subcityId = await ctx.db.insert('areas', {
      type: 'subcity',
      name: 'Akaki Kality',
      parentId: city?._id,
      displayOrder: 0,
      active: true,
      links: {},
      updatedAt: now,
      updatedBy,
    })
    subcity = (await ctx.db.get(subcityId)) ?? undefined
  }

  if (!subcity) throw new Error('Could not create the Akaki Kality sub-city.')

  const existingWoredaNumbers = new Set(
    existingAreas
      .filter((area) => area.type === 'woreda')
      .map((area) => area.woredaNumber),
  )

  let createdWoredas = 0
  for (const [index, woreda] of initialWoredas.entries()) {
    if (existingWoredaNumbers.has(woreda.number)) continue

    await ctx.db.insert('areas', {
      type: 'woreda',
      name: `Woreda ${woreda.number}`,
      parentId: subcity._id,
      woredaNumber: woreda.number,
      displayOrder: index + 1,
      active: true,
      links: woreda.links,
      updatedAt: now,
      updatedBy,
    })
    createdWoredas += 1
  }

  return createdWoredas
}

export const admin = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (
      identity?.issuer !== 'https://seed.local' ||
      identity.subject !== 'admin-seed'
    ) {
      throw new Error('This seed can only run through the developer CLI.')
    }

    const authResult = await ctx.runMutation(
      components.betterAuth.seed.upsertAdmin,
      args,
    )
    const createdWoredas = await seedDirectory(ctx, args.email.trim().toLowerCase())

    return { ...authResult, createdWoredas }
  },
})

export const directory = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (
      identity?.issuer !== 'https://seed.local' ||
      identity.subject !== 'admin-seed'
    ) {
      throw new Error('This seed can only run through the developer CLI.')
    }

    const createdWoredas = await seedDirectory(ctx, 'seed')
    return { createdWoredas }
  },
})
