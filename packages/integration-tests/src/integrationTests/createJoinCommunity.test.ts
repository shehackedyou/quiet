import { Crypto } from '@peculiar/webcrypto'
import { assertConnectedToPeers, assertReceivedCertificates, assertReceivedRegistrationError } from './assertions'
import {
  createCommunity,
  joinCommunity,
  getCommunityOwnerData,
  registerUsername
} from './appActions'
import { createApp, sleep } from '../utils'
import { AsyncReturnType } from '../types/AsyncReturnType.interface'
import { ErrorPayload, SocketActionTypes } from '@zbayapp/nectar'

jest.setTimeout(600_000)
const crypto = new Crypto()

global.crypto = crypto

describe('owner creates community', () => {
  let owner: AsyncReturnType<typeof createApp>

  beforeAll(async () => {
    owner = await createApp()
  })

  afterAll(async () => {
    await owner.manager.closeAllServices()
  })

  test('Owner creates community', async () => {
    await createCommunity({ userName: 'Owner', store: owner.store })
    // Give orbitDB enough time to subscribe to topics.
    await sleep(5_000)
  })
})

describe('owner creates community and two users join', () => {
  let owner: AsyncReturnType<typeof createApp>
  let userOne: AsyncReturnType<typeof createApp>
  let userTwo: AsyncReturnType<typeof createApp>

  beforeAll(async () => {
    owner = await createApp()
    userOne = await createApp()
    userTwo = await createApp()
  })

  afterAll(async () => {
    await owner.manager.closeAllServices()
  })

  test('Owner creates community', async () => {
    await createCommunity({ userName: 'Owner', store: owner.store })
  })

  test('Two users join community', async () => {
    const ownerData = getCommunityOwnerData(owner.store)

    await joinCommunity({
      ...ownerData,
      store: userOne.store,
      userName: 'username1',
      expectedPeersCount: 2
    })

    await joinCommunity({
      ...ownerData,
      store: userTwo.store,
      userName: 'username2',
      expectedPeersCount: 3
    })
  })

  test('Owner and users received certificates', async () => {
    await assertReceivedCertificates('owner', 3, 120_000, owner.store)
    await assertReceivedCertificates('userOne', 3, 120_000, userOne.store)
    await assertReceivedCertificates('userTwo', 3, 120_000, userTwo.store)
  })

  test('all peers are connected', async () => {
    await assertConnectedToPeers(owner.store, 2)
    await assertConnectedToPeers(userOne.store, 2)
    await assertConnectedToPeers(userTwo.store, 2)
  })

  test('disconnecting peers', async () => {
    await userOne.manager.closeAllServices()
    await assertConnectedToPeers(owner.store, 1)
    await assertConnectedToPeers(userTwo.store, 1)

    await userTwo.manager.closeAllServices()
    await assertConnectedToPeers(owner.store, 0)
  })
})

describe('User tries to register existing username', () => {
  let owner: AsyncReturnType<typeof createApp>
  let user: AsyncReturnType<typeof createApp>
  let userName: string

  beforeAll(async () => {
    owner = await createApp()
    user = await createApp()
    userName = 'Bob'
  })

  afterAll(async () => {
    await owner.manager.closeAllServices()
  })

  test('Owner creates community', async () => {
    await createCommunity({ userName, store: owner.store })
  })

  test('User tries to join the community using the same username as owner', async () => {
    const ownerData = getCommunityOwnerData(owner.store)

    await registerUsername({
      ...ownerData,
      store: user.store,
      userName,
      expectedPeersCount: 2
    })
  })

  test('User receives registration error with a proper message', async () => {
    const userCommunityId = user.store.getState().Communities.currentCommunity
    const expectedError: ErrorPayload = {
      communityId: userCommunityId,
      code: 403,
      message: 'Username already taken.',
      type: SocketActionTypes.REGISTRAR
    }
    await assertReceivedRegistrationError(user.store, expectedError)

  })
})

it.todo('User tries to join community with offline registrar')
