import { ConnectionController } from '../controllers/ConnectionController.js'
import { BlockchainApiController } from '../controllers/BlockchainApiController.js'
import type { SwapTokenWithBalance } from './TypeUtil.js'
import { OptionsController } from '../controllers/OptionsController.js'
import type { BlockchainApiSwapAllowanceRequest, BlockchainApiBalanceResponse } from './TypeUtil.js'
import { AccountController } from '../controllers/AccountController.js'
import { ChainController } from '../controllers/ChainController.js'

// -- Types --------------------------------------------- //
export type TokenInfo = {
  address: `0x${string}`
  symbol: string
  name: string
  decimals: number
  logoURI: string
  domainVersion?: string
  eip2612?: boolean
  isFoT?: boolean
  tags?: string[]
}

// -- Controller ---------------------------------------- //
export const SwapApiUtil = {
  async getTokenList() {
    const caipNetwork = ChainController.state.activeCaipNetwork
    const response = await BlockchainApiController.fetchSwapTokens({
      chainId: caipNetwork?.caipNetworkId,
      projectId: OptionsController.state.projectId
    })
    const tokens =
      response?.tokens?.map(
        token =>
          ({
            ...token,
            eip2612: false,
            quantity: {
              decimals: '0',
              numeric: '0'
            },
            price: 0,
            value: 0
          }) as SwapTokenWithBalance
      ) || []

    return [
      {
        name: 'SOL',
        symbol: 'SOL',
        chainId: 'noop',
        address: 'solana:1:noop',
        quantity: {
          decimals: '0',
          numeric: '0'
        },
        price: 0,
        value: 0,
        iconUrl:
          'data:image/webp;base64,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',
        decimals: 9,
        logoUri:
          'data:image/webp;base64,UklGRhYbAABXRUJQVlA4WAoAAAAQAAAAjwEAjwEAQUxQSLYLAAABD9D/iAhgmrXdkeQ2z5c341Z2KKcnMbO5oykCCSPvsmkmij5h6O1S2iWMPE3RkyvdxjBGME0GzEbe/QJ6cqW4cAN6buVV8l5qyHuXmV/e+hrcR/R/AlB31GiDx2BDqap4nm4WvP4MfNEEUfeAGIiC/qA4A96E03HFAO+j0Zl8L8FcvJszGM9aFAMxUqquYO+CBWrs17SqLx5YKJecs7C0v8dCs4BPnIFHxAAfXXBiYqnHfmGiXGCzrFtzaa2LYmFIiMZmewZ4Gn1tAipVLG0EXW3Cdyqbga0qPk8hncpmdIO5tEre2jfJtffmaPkmkKQ31yKFuWgv/Sv61hmIP7TA5sEZoOrNDdVg7pReFyzE42NRIQZwS5wFT61bWVhcnYFg4QqDqjXxikpnc1Pbix8TnbcATlfaKGqVyXieRrURA5ynU33BBN1WlToLUXQ2zwJD4VSnS+o8UUrV0eGCda56H5nvl7WqYmGbpyg3usoC9VbFksxDg7qPYqDvdOmPWOizMAwqPrSkyhLPO93iTKtiL9lL1QOyoM1TNK2KxkQYdN2CzCeXk25Ycj5LvDmKKpm4G6eTBVWeFXvNw5LGhFvQLcnsQquyWewnShYC+trCLiKqxZnSfnwufeE0L4UmCw2liiVdnoDXFRr2sNGpo4BkWR80ulKThJjpMvpa02J/sBI1CagtnGhYQW9Bv4LBWrASFBIgmmg1FUSxNbah99hsz8CgMuvsNd5eKBUVEC2ow0js4SwEN9fhsH42gMHCRmG4PVudlWc1Wyv/vcRZ+FdFD3DZQlrSWIgyRxSMaiggWthVC5KFYT2VwA8wWOBwahyB0oKoxFaC3oyfikKPw/aoMAY9ayNpM4cP0FroX6E4xAhXFONk4vUL4hkwH0sjUmhqe9Sws3CF6Y7JrQWaBa2JbgpYY/QToghWohRzjZkjxRCBLs9F5zR8Qeb6KNDm+VYvqg1aR+51ibqb2YDbAZJlaVcrCivNTAcM5N65VsUMxT6AlSY6TWssCoGQLTiv4R1TVDAKeb7dod6UU/XUJs93LGjqqf2uCar5firlqdjq/NQAJEiShbDTHU5FYWhL4lGeUlaqkxloWw+Z/IIHZGLSQ5eldXjVI04hntyX0Q8XFS7fpSUXpuqpKFl+I+jmA9xYkTuQt4F1MLbn65IlwjCq8pxIoSoUu1GdJ+BVbgpIeLJ71Lswxz5qXWpMVDqrvaprz8Cg2OxjYVKEPbyWSjUoKnMlSfJ5OlWagUj+9QKbm3w+X1eRu85HyFbtoYuSaZ9JDs+ANxcF+0X9PBH2ko44g/0ZGM7AGSzOgM/07XupGbLct5eKLkvaS0+TpYUmXxRydUaSn0EYahslmo78j2Rr9iGadDS333c4jfyIJu7hw0NUuOsqybdVXUZd56NAKbp+Dw4/R6ca9rKaS8+paPJFlPFe3Q35kgZfaaLL9y7VIep1vhPV2shHVZ0iCk2+SFKEgznYB1dRVlae0qDbY1SlrRFpzEFQdElRE0d9noiyfb2imkp7Y6OIwjhKFoKm86qQBKo8paYtVE0UWO8t3T7HIQlgk0umSugVnkQFp5LFMbugIBL2F0go10ALHVn/FWSGvpqroGSPCUU9hw2HvgYkm48ysQIaBbSchy4PTJXAI6IZOIRtrrw1CWDIs6LKUhJHfa4w8QpPPKcYd+Ru6SY26HdMF1kgShaxcJtAN8zhpvK2URgHD/HVCg9ILnQ3Kcq9MPNnkK4qxh00mXw94r2QnlL1AKeZZluI96rSaLeXhKAe2Ge1nRiiQKNo9zNMtH7Bnj0FgH8VROdsVMVEaSl4P/qix+4Vvx6lanSrjTWTpqoZ6eAqRrudAFQAYqOHUuFsJKhH14+AP3I2jqUY/acD/lRMRJjYeOCPsdqMoICVkXq9nXLgjVRhCwE+IZCMxKMIHXQYHoDWWM/kazso1zaiRLgN/APA99uAYqI4EfgOQ+2K/oUF8bKVemAHt68hitjogB1RagAjW2C9Au4BWhu784MbpTvtpFVLCyQBvA0KWLcd4x024znaeubUSkmXEvDXsLnRBgOBJwTTWzgLiSimhouUVeUmqt4GzpWh8hMhmdldegM88qOOhNk/Ov8/EFcQD8ys/K8Lk3bwPys0TQDEyFP4g1ED0cpxOBKmE0YDR6vbocTu4Lj5qrHWwfF52P2xHWirWxpoMBWudNYIHQWkYKn7n9trIFpqp5Il8FH4mQBRFAVpP0WE39jADuWKuJePH9Xwx//q2VLPHbLnj0sBAeJzMge4Pa0meA615Gv5ehfPES+TUYiSpeTNxZsDtECUuQihJXfJF/2bG1uBBw4ogN9guYc6C3ByA8AK+kZRAGvocz2QxQEbGPIIUACXWN7to5CC3bcIUOqyB6gfE8duNapNbDZ8mKKB68AWdZck04c3/CuugbuWtcll+m3hgeNjx6zTgM9ES9cAPD16L/MOpN5DN7rLUPLcM+pGUQH4bALQQFoBj5RzATySyel+ZkHMdegZiEyvmW+BXO0rgGbiAKpvn2NFBdDkaEcA8QD40WUhA9IRz0EZ6ACnAKIj7w0tcZX6smKAKKWKTO2GjuKvd9D1EMOCAYYMSW4v+gYgrYDg5lqoOrImud3POKDR1U0mxANDYDIqAB8dlMv41wqaC46KFzrAlRpwZP1wDd3liRUgC4osiesvYheewsejGlJAX2ehTwDDA0CA5lhRQQG0GdLUbwAdhKcUIdtvvCq+4ZAmOaaTzAFFJOsr5Isrmigy9b2KHhjJsla+KuAY1fAK5hPTGbjyUxRACx3wrzIHvHmoyfprU9sZp3p9n6UMiRpe3u5gGIloIAtdfFtTgGuhA/gi6iJAWtbyja4A6WZ+Y0GTIwjp3oLU/pEwjIKoarIe3uxq4LZrB0ABwnwPxUiWHa0mvCHprrmCn+ESwBZ+o5oDakrwiw75qiugpQVeiF4glmQ89F91jI4Ap4sjsm78ACQEqFcqKjLvgu+B2IxKD7KgzBB2cl2iwOYJpg8U4xylh3j3CrpjmeJQ5QD8kkOIt3vors7dqCpycGM6eWUxkNYf2kINpG6uLwipzLD99pN33jUAVIcQUUfHQMny4coDb3mHMegPa0jdUQ9xDUSZyS7DF47XAC8FGCXUDugXbX/m+AUL+n0FoI4njvZUCtjdCgeKAUgsvgRS/0wUup0rIAkcuLme6WLJ547esQZaPFAC8arMzHtdW1W8gxrwjF/O0gEP9YJQcRclUE4cLWopodK506q+/z1Aikc1JIBecQEcy8Ph6fEn+Y4S8MBKoCjmtmQdfWKqmPFuP+6UT7xoW4M7fUJgKIF/PpobbwQKFds+fnIICNOxhB3zEQKepW0fH727wc2kEnqNZOHVh1Hi07C99rG7IQFcUE3WqlV707PBn97VMnhWQAkUc5MbiLouPvHSd23va8FzCHiWj0QDHZ9wDL/RMt0KUKsE2C24yCOO9u0t7EY7B5SLEupvP99/wkEL1ak4UvLEu5kfyFimN/PeXYwBHhCA8yxuO7eg7r/Ie1MaVRM3ZWhXC9Z84ksviHczfvPhieNfR/eqoFrg8B0X7r1WHsDtDY7wemBQpdGgkYlbf7o8IN49qn5wb4FNetFJzW9APDqMwBWW9wu4q0ndz98Mr99AKIHXjoq5Fqggqa7TP/L4AL+xgaYGrgODmxumosZxex9dA5eeoABc6gTqMAd0fYH61tinJI88d7M4iqKpobsTaBQCS25LxD84jv9xKx6KZg1XXgsDSsfidRROBQi3e4jMRoUnSae7EeGU0R8UOpmrSdLobvVxVTSE0G6Z9RCjmwtMJkXwp/E9dUPJWz33FEDvhbhTANVXUQe/je+pAyVf9dwxSvePRPdFUSFCPTxewhcB4mVSFNih/4RuVfmj1/6ShGfb449UPa6D+w/gtFV1AwuuHd3zy1P1gGvhWoZeB584+MOLF8PldE08UDIdFEI6Fp3AI87VDKlioucOFjvUQeATzpV0E64k8VrA6bwOVlA4IDoPAAAwYACdASqQAZABPkkkj0WioiESOaw8KASEsrd//5YMuJrdp51s+8mf/1cpqAd7Kk+5njRe/fxlaPEwX77cCv0g/2+6N87vpKP5T/0OuD9ADy1vaM/Yv9p8y22FdoOurv6g7JIOupLy4ZxpPMKoch/nfKTydLSvE9bw/Ai2ThUBnV23e8spdwkC34uvyw///dSjPLgUZMd14+Tco8oMHf//9p9BwXEV/wW5GxSavkr5ernuSMnvVdBNX2QTsAMX/CAwKGR0EQkNpJfBIhJOpEL0CgEkDyK379yVhtNCCPbN19BxAY35JzSyAQFmFkjgZzYQYvDgQn/Ljcxz53jaAItVaGdz4JkueMcDLovDTdt37HiZftYXGaD3Owp12mAf30mECvBU2h+aYdlFwHoNSC/djDiIZ0YWz/slOeifr9V+MfNfx0RmeTeBkY+5Bywrp82z/+/mxot+DTKn2ZBplT+fXCZ4n7QPQy9kRnRYe5myZPIH5NBWbtekeweXqo4ed796V4h2vznWwKGEo/YhexL9RDCSNzlgYDrOfi6m630FVqtEthz2IfQVWqIsfINpj93uQy/l6mjJUR2+VUMlXrBqz1qFNuC59uz875SeDcjQ9yTs9xDixekXY7fGiAY6zSloGvfZ/3B/mK+AZvh4/9FgSs/v1uSb0TQjlf59Q/iBLMXV1k9tvjnKytLu+hbtjk/PWg0GFvh3cg5VRLR7h8lHmFCSH9T9+G9+JqDN6xbq2mK3obprhoYvvuQ//zK83EZLxwnINN0uTVyCIQBumP3WGBjSRm3sThvWf//9hGV5ZCZGXl8uu8ope4ry4pIpUEEBKue3JHTW8UQFFpiTXN/VzVtMufP0q1mkSnRjRa1RL64o8kb5VX8sqkhdLUR6YpfMnvUNE0/Qc/ltCTFEOLx0OB/0V/yLrlkQm46qppZS/JK4dVjQZrV9FGl+V+f4f+4j9rxo3YwIoqC/N+//mfqD/abpr3FnfKKlPr0LYJNl3e+eaEGC6kOHGlLO+eDplyKIw6eH3/TS/5QAAP7deMeP7d2+Av1BEL55N/bvpiQesBsWUBg3V4UG8YabMCZJM1H5I/zUG5kFtNVfNZx0/LhuJcZmx+HV0+5XmkN+FvcKlIocX+f0ErPQZc8JIX75HwrpV0QkjvzCGKMR5HREU/2AoKauWq6S7JUMr33Bxz/QV7x3+jGpdaBsYz7amp9tJcmwO3/Aiqp2eF8gzJfiIS/OTggDGGtFq1jdtEsztWiXdgHVpC3JV8PHpbWKqG8Q9B92tsKbvccd+wmt7ymM8j2skAc1tV60LnbY1M77BMgPLIaB7ENlWKd6RpooCiZwdaVp9MuG55qcrG7JsxG64ZFGg+J01OU8+LdJWGcVgVHGvj6zc/aSv0DJzxzCKEyrSWKd36fFKIG6bvegdymRNlrKkXQArupxR3KS2sUot2J347reXcLsmq5XSNSrXDc5Sc6HL1s+Y1b/U99fbg43P4HBAhtUVIdvAHq7ffmsYDTqd9cj0rr3A2TRcgTa+kVUs/GV2vFBG0WzMLsFkNwugi7LXUpbL715ehTYcKch6f3LWdV/VM7S091ljSC2c3ddI7gzBhneWVU50zNOTfkIWbe8ffvdgu9Z21MdQL4aPtZqO4Nz8wNGEcw+4V7KBaSapC/ji6LCtmXweinDU9AJ7+/acKk1U7ljw8gHlcIpPODQSAMxG4CAO2Ard1VWNBJY3MvMUJW+JcWDCU5wSzLgqfZIbJ9eFGhA/4xXKsROf1015nq882No27sbyXUqUs6pLD7TYD6R0b047ZCf9wgPfPd0b+SkZYobG0J5G0AEaCoJMKYZ4fuxF4h8tAevtLXP5PSPk4+XbCBI8K1S0iOGhByrH1qWBbuREMmAKAo+DlpbQRT3aRGdM4urlnfSmP0ki6DvGmqfu2v1RzBEDxb/p/nIjW+RRuXnqON0guJlcTa0/8siZUfmPp2BbLfcObvqL6l44OVc1qu0RvuHeGZ4k8lJn+01eYVXg8nUbH/i8PqboXxQ20Xrs90anOoEcEO8f7CkGCTSrLGAeghdnLfZit8cc+afkdqqhhW7L0U61GUXEwRVZIPXgLAIDidebmywaeab3WSa2ZDUGwXibfJ0LoRiBt/dTBy8RjsjppCcSS4AAAAAuzpaBv+wT8Z8bk7wlmE5hlSfSbtR3tEiP90ANHEYAXwjYfx+N3PZ8OXiJrw8SSTIk+M9humKkM7XwXs7m9y+/yY3ODf4ZAyrAYnt19sVEeIqLy6NTUeOM+E/BvXtq0HzrHDhlotgjxLnueoKu+nJJdYp60DLdZ3rqJm12fj243txam4kgaAw5BsgCYIVNavLEAKRkNIDA+A039RoAHEMABUFDCzaWZXbTX+P0htSE+Qs/+5lekYcs5on+Jyv9Mfag7Rx3H9Wizr4rQqyXhQlAdhszqjndyXJ0BGI+Bg3nOGuyxMLzBZMHXgmpRNa9jSB7L5ly1wPVfS83eDZ7JWIF3oolcBKNpnzZoO/Kboe8XeL41N0s707mLUAGH1yVzkHf7jnkKLu/N5zNpUVPgdECL1iFlW26m2Py0djbkI9kVUAvYAGoyefLsctKZQ61J47QNDkW23eE9SNq1LsfIu0he5Nfg2/kGvgXF26LE3S05u4WLCyS1HeMGJqQTaGrbyXMysq6P00P68VnrtLSJVKmLj3nrj1pi9Bb9qgxAoRlx9OMcDfG5bj6mnhGnCl828z+T9gKbmmGfvmcqRS7PFNPGq8Cv/FrKBEbRp5xReKUEYpN1BHX47bV2aAmFstUrGb7ee/nrdhG50y7YzL7vcmOhsdE2NLvMZ6IisAjU6EKWpynVNGjE43I06yJRAZn73ZM2KzTKCM4XCjfjJbLqRlt5MvFy2yFtYdR/TW3LHeGQS4sGMq6z8xKJWxq4aPp8PT4axvk0pZOQCTDURQlS5FsHxupHRyRjf/b/KzEftCygRoNUhMOb53L7blpHxgRhcoKBnieCj8QxuoRcDH/qbeUXIkqziHdZrVeVdgEcBG5yHXfOZNCzAcvZXbzOeob6c2Tea5QnfMRZ6uK03wmU001EYma1rTSbJRYqrz9vk2ZKplXZrt3lX8FcKxtYI0Jm4aEgEXl/lKwvVesJ6DBC+TJBeFaTMp9K0RjABKULcwJWYWcszBD9a3cfylwju/kuLIaFdIFRm4T9rqhkt+xBNIqlUc+H4I7DNHSDTIIlRTtoGo1tep08F4D2UrlvVvfL/6WXJT7SaFX5ToR4OPUKEqsYDqhM8QGZn4abKB4+u+iI0pyzADD+Uu/aYSQr8x7D/sik0nRq/k4SzMdhKAGfFeqhpMwCbFBeiMZeh0rhnI3AkfVFLdhElzkXiPNjvlM7cgTJUjH1Olva2t77H7+maztPDOeX89oruaCj9oZBJlvWhF9PgvxGZsQHIzhIxNqnHprQrv0EpsFc+2DcC31a+RfsgIU60nNl8jVHif/DjWL5E0Jn5fb3c/AObeYI6jPjPnc0KxQ28PfhChZZUd1vE2cCs2ibKphJnWIj7iiAo8oDElPEsLKKqxYN9rThlesydp8YBVbnx/tuW4Qy+nt57NUCsk3TBNsrt8iCUW1XxYGVXyMfjbbx1NNaOHNpsWZ0m9qGLCFN3sajNiD85EdZo/fmdZVwIYRqpqMLMU++Ak5Ow0NjZMDsPm1i0oWngjMqAvLH+G1x/9+ktpSrOLo7tHFgVb79BLtxvJoGgokZuZ15JMotu3gc57uxB+bQEzPh9wjsHcaRfYCIDGp9hO1pDb2VtPxIemEcPNL7b0jC1rwKCtUdXGZA6qCOiCbq5LAerSMmSQDkJGukcd1Q8n7MdZPOaLB+4LbCNyp3SVDNX2SB6jTqf8JhOmsA+f+nfoOgC33q0V9DsxjmGV9Ew0+qAsm+9jAgG9NLIIyhKmgQrG5mBss1P1jxyXDKW4+S8hZW9QP1N8oTl2KWoaIp5HsPdjy32MESHKBr/0rMmMJ1m8TBHxTQ1EPVfsjzT52M/tS9QguLb/EOG6L3MaAOndZBr1d37u3j8fBIbaKiLCWkts8sV2baMLPGK1lPKKBYnQL8iEqCB/F9NXbr8aUMcRAvB5Qiv0JLtLqYa7sDZXXsej+C50KoDjJgGKKGFy1/zVk/XJP4GtxWhYQCyJYDG42qe6pPgspd1zje/ORze8lRO9KydBIpP+rDTnT3wpcjoN5jGXs9rLOJqPp+/rzKR9xl/igcPrxM3QcvKNNqA4eGKxicDlLrxRUJVIdKuR+wEuhtQIvALdEa751g0G9GO2zKt4VjNAW7vTuwlnBi7eFCJb1cILatd5QRMwAQ1O7ae2Iod72vibqEZnMzNIZr3MnnylqGQlQ2jXEVIrKh/N2TGCibqnE1g2WrArpGCyFiY3gE8OvnXn9ErHnxqu+b7EBioNpKbH0STaf729STZpGxl0gfepr1vqplfZ+xTGoSOwszxoHT5c8LNlVC+f4TFr/IoKEbG8GPMwZ1rA32K5GgLj76wMKmf1Cm/Sm4Ow5ahde0/x4OToUZfj6NfKN+u7sKMb23m5kRhhZYzkhJDPVkQga9O/MtvfJ+RZqyECrCBL7vVzhA2NoU1cbRfZNge1RPlSRYa09nIBuSBYB9u7Q4Obm6fKNySxpEQXCNP2Ufg7XJ/8757DPxIFL+cT9b7FuS9e6HG0ckKykXGvdx3MJ/KMXZr6oWpD/oJ40ZjZFerxmvrC+AM96b7ZtJ3RUWwsdXriGGp+wA6NymMGKyzKhWFGK2Veuz8Q3cVoTVevt6463XzgZ+uhAS0vPHxSfzrxyPRi/83F1xwHjbCQBzNfI54HgrjEQ0SuUJ0EcqVCTnwMH9FyZpFSAzc5eqOX1w1DBKJB1W9TvURzV1jBuW+WM71R/o7TKcdXAI25hqkfRAe461CtVTjf1YsUcz7ono3BziYTOHWSxorJFgVD9c/cbketggq4rZ8DjyNdQ/WDKTOqpSryq+PfsAEUt8D/9wIbY5ODOxvzrzt8OfuCyiuPQ39QcanPKZCIT+110O/GMigo1rhhULUH53xHdKqLgSWxuhlXiZQp/Q1giOMFmNBuCGJXMHUOcnDvwTEH1cmYW9bVH1Bggq9gzOBEAAATtv8yMhIkhpffFttR4rMXMlTeSc/iW6k7At5EqoLSHMMzS7uIlCtjoffxUkmmzToV15hIAFCDMw8IenqkwAAA',
        eip2612: false
      } as SwapTokenWithBalance,
      ...tokens
    ]
  },

  async fetchGasPrice() {
    const projectId = OptionsController.state.projectId
    const caipNetwork = ChainController.state.activeCaipNetwork

    if (!caipNetwork) {
      return null
    }

    try {
      switch (caipNetwork.chainNamespace) {
        case 'solana':
          // eslint-disable-next-line no-case-declarations
          const lamportsPerSignature = (
            await ConnectionController?.estimateGas({ chainNamespace: 'solana' })
          )?.toString()

          return {
            standard: lamportsPerSignature,
            fast: lamportsPerSignature,
            instant: lamportsPerSignature
          }

        case 'eip155':
        default:
          return await BlockchainApiController.fetchGasPrice({
            projectId,
            chainId: caipNetwork.caipNetworkId
          })
      }
    } catch {
      return null
    }
  },

  async fetchSwapAllowance({
    tokenAddress,
    userAddress,
    sourceTokenAmount,
    sourceTokenDecimals
  }: Pick<BlockchainApiSwapAllowanceRequest, 'tokenAddress' | 'userAddress'> & {
    sourceTokenAmount: string
    sourceTokenDecimals: number
  }) {
    const projectId = OptionsController.state.projectId

    const response = await BlockchainApiController.fetchSwapAllowance({
      projectId,
      tokenAddress,
      userAddress
    })

    if (response?.allowance && sourceTokenAmount && sourceTokenDecimals) {
      const parsedValue =
        ConnectionController.parseUnits(sourceTokenAmount, sourceTokenDecimals) || 0
      const hasAllowance = BigInt(response.allowance) >= parsedValue

      return hasAllowance
    }

    return false
  },

  async getMyTokensWithBalance(forceUpdate?: string) {
    const address = AccountController.state.address
    const caipNetwork = ChainController.state.activeCaipNetwork

    if (!address || !caipNetwork) {
      return []
    }

    const response = await BlockchainApiController.getBalance(
      address,
      caipNetwork.caipNetworkId,
      forceUpdate
    )
    const balances = response.balances.filter(balance => balance.quantity.decimals !== '0')

    AccountController.setTokenBalance(balances, ChainController.state.activeChain)

    return this.mapBalancesToSwapTokens(balances)
  },

  mapBalancesToSwapTokens(balances: BlockchainApiBalanceResponse['balances']) {
    return (
      balances?.map(
        token =>
          ({
            ...token,
            address: token?.address
              ? token.address
              : ChainController.getActiveNetworkTokenAddress(),
            decimals: parseInt(token.quantity.decimals, 10),
            logoUri: token.iconUrl,
            eip2612: false
          }) as SwapTokenWithBalance
      ) || []
    )
  }
}
