export default (environment = 'development') => ({ // eslint-disable-line

  // link file UUID
  id: '57c96dfc-36e7-11e6-9a05-82a9b15a8ee7',

  // canonical URL of the published page
  //  get filled in by the ./configure script
  url: 'https://ig.ft.com/sites/2016/ipo-unicorns/',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2016-06-21T17:11:22Z'),

  headline: 'Unicorns face tough road to Wall St',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'With a pileup of tech companies in the private funding market and public deals losing value, what will become of all the unicorns?',

  topic: {
    name: 'Equities',
    url: 'http://www.ft.com/markets/equities',
  },

  // relatedArticle: {
  //   text: 'Related article »',
  //   url: 'https://en.wikipedia.org/wiki/Politics_and_the_English_Language',
  // },

  mainImage: {
    title: '',
    description: 'Uber on the streets of Paris',
    credit: '© Reuters',

    // You can provide a UUID to an image and it was populate everything else
    uuid: 'ba6bdaaa-2e52-11e6-bf8d-26294ad519fc',

    // You can also provide a URL
    // url: 'https://image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Fc4bf0be4-7c15-11e4-a7b8-00144feabdc0?source=ig&fit=scale-down&width=700',
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Nicole Bullock', url: 'https://twitter.com/nicoleabullock' },
    { name: 'Joanna S Kao', url: 'https://twitter.com/joannaskao' },
  ],

  // Appears in the HTML <title>
  title: '',

  // meta data
  description: 'With a pileup of tech companies in the private funding market and public deals losing value, what will become of all the unicorns?',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  socialImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3Aba6bdaaa-2e52-11e6-bf8d-26294ad519fc?source=ig',
  // socialHeadline: '',
  // socialDescription: '',
  // twitterCreator: '@author's_account', // shows up in summary_large_image cards

  // TWEET BUTTON CUSTOM TEXT
  // tweetText: '',
  //
  // Twitter lists these as suggested accounts to follow after a user tweets (do not include @)
  // twitterRelatedAccounts: ['authors_account_here', 'ftdata'],

  // Fill out the Facebook/Twitter metadata sections below if you want to
  // override the General social options above

  // TWITTER METADATA (for Twitter cards)
  // twitterImage: '',
  // twitterHeadline: '',
  // twitterDescription: '',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',
  // facebookDescription: '',

  // ADVERTISING
  ads: {
    // Ad unit hierarchy makes ads more granular.
    gptSite: 'ft.com',
    // Start with ft.com and /companies /markets /world as appropriate to your story
    gptZone: false,
    // granular targeting is optional and will be specified by the ads team
    dfpTargeting: false,
  },

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
