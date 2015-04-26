var App = Ember.Application.create({
});

// Resets scroll
App.ResetScroll = Ember.Mixin.create({
  activate: function() {
    this._super();
    window.scrollTo(0,0);
  }
});

// Router
App.Router.map(function() {
  this.resource("team");
  this.resource("mission");
  this.resource("expeditions");
  this.resource("projects");
  this.route("get_involved");
  this.resource("press");
  this.route("submit");
  this.route("volunteer");
  this.route("contact");
  this.resource("legal");
  this.resource("releaseForm");
  this.resource("books");
  this.resource("book", {path:"/books/:book_id"})
});

App.IndexController = Ember.Controller.extend({
  image: "img/banner.jpg",
  youTubeLink: "img/youTubeLink.png"
})

App.TeamRoute = Ember.Route.extend(App.ResetScroll, {
  model: function() {
    return this.store.findAll("volunteer")
  }
});

App.BooksRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('book');
  }
});

App.BooksController = Ember.ArrayController.extend({
  phrasesCount: Ember.computed.alias('length')
})

App.BookRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find("book", params.book_id)
  }
});

App.GoogleMapsComponent = Ember.Component.extend({
  latitude: "",
  longitude: "",

  insertMap: function() {
    var container = this.$(".map-canvas");

    var options = {
      center: new google.maps.LatLng(this.get("latitude"),this.get("longitude")),
      zoom:2,
      disableDefaultUI:1,
      mapTypeControl: false,
      minZoom:2,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    new google.maps.Map(container[0], options);

  }.on("didInsertElement")
});

App.Volunteer = DS.Model.extend({
  name: DS.attr("string"),
  location: DS.attr("string"),
  latitude: DS.attr("number"),
  longitude: DS.attr("number"),
  photo: DS.attr("string")
});

App.Book = DS.Model.extend({
  url: DS.attr("string"),
  dateCreated: DS.attr("date"),
  lastEdited: DS.attr("date"),
  createdBy: DS.attr("string"),
  location: DS.attr("string"),
  release: DS.attr("string"),
  sourceISO: DS.attr("string"),
  sourceName: DS.attr("string"),
  targetISO: DS.attr("string"),
  targetName: DS.attr("string"),
  phrases: DS.hasMany("phrase", {async: true}),
  title: DS.attr("string"),
  banner: DS.attr("boolean"),
  bannerUrl: DS.attr("string"),
  sounds: DS.attr("boolean"),
  videos: DS.attr("boolean"),
  editing: DS.attr("boolean"),
  comments: DS.attr("boolean"),
  // phraseCount: DS.attr("number"),
  views: DS.attr("number"),
  saves: DS.attr("number"),
  shares: DS.attr("number"),
  embeds: DS.attr("number")
});

App.Phrase = DS.Model.extend({
  book: DS.belongsTo("book"),
  sourcePhrase: DS.attr("string"),
  sourceAudio: DS.attr("string"),
  sourceVideo: DS.attr("string"),
  targetPhrase: DS.attr("string"),
  targetAudio: DS.attr("string"),
  targetVideo: DS.attr("string")
})

App.SubmitRoute = Ember.Route.extend(App.ResetScroll, {
  model: function() {
    return {
      title: "Thank you for submitting a video!",
      text: "We'll be sure to notify you when it goes live."
    };
  },
  actions: {
    closeModal: function() {
      $("section.success").hide()
      $("body").removeClass("modalFreeze")
    }
  }
})

App.VolunteerRoute = Ember.Route.extend(App.ResetScroll, {
  actions: {
    closeModal: function() {
      $("section.success").hide()
      $("body").removeClass("modalFreeze")
    }
  }
})

App.ContactRoute = Ember.Route.extend(App.ResetScroll, {
  actions: {
    closeModal: function() {
      $("section.success").hide()
      $("body").removeClass("modalFreeze")
    }
  }
})

App.SubmitController = Ember.Controller.extend({
  actions: {
    openGuidelines: function () {
      $(".guidelines").toggle()
    },
    openTOS: function () {
      $(".termsOfService").toggle()
    }
  }
})

App.SubmitGuidelinesComponent = Ember.Component.extend({
  actions: {
    hideGuidelines: function () {
      $(".guidelines").hide()
    }
  }
})

App.ReleaseFormsComponent = Ember.Component.extend({
  actions: {
    hideTOS: function () {
      $(".termsOfService").hide()
    }
  }
})

App.VolunteerController = Ember.Controller.extend({
  actions: {
    openGuidelines: function () {
      $(".guidelines").toggle()
    }
  }
})

App.VolunteerGuidelinesComponent = Ember.Component.extend({
  actions: {
    hideGuidelines: function () {
      $(".guidelines").hide()
    }
  }
})

App.FormModalComponent = Ember.Component.extend({
  actions: {
    closeModal: function() {
      $("section.success").hide()
    }
  }
})

App.SubmitView = Ember.View.extend({
  templateName: "submit",
  name: "",
  email: "",
  link: "",
  speaker: "",
  language: "",
  videoLocation: "",
  transcription: "",
  translation: "",
  message: "",

  actions: {
    submit: function(event) {
      $.ajax({
        type: "POST",
        url: "https://mandrillapp.com/api/1.0/messages/send.json",
        data: {
          'key': 'ZMiPM6bTRAzqjOaIqzn-tA',
          'message': {
            'from_email': this.get("email"),
            'to': [
                {
                  'email': 'hello@wikitongues.org',
                  'name': 'Wikitongues',
                  'type': 'to'
                }
              ],
            'autotext': 'true',
            'subject': 'New Video:'+this.get("language"),
            'html': "Name of submitter: "+this.get("name")+
              "<br/>Email: "+this.get("email")+
              "<br/>Link to the video: "+this.get("link")+
              "<br/>Name of speaker: "+this.get("speaker")+
              "<br/>Languages spoken: "+this.get("language")+
              "<br/>Location of video: "+this.get("videoLocation")+
              "<br/>Transcription: "+this.get("transcription")+
              "<br/>Translation: "+this.get("translation")+
              "<br/>Message: "+this.get("message")+
              "<br/>Release Form: "+this.get("releaseForm")
          }
        }
       }).done(function(response) {
        var status = response[0].status;
        if(status == 'sent')
          $("section.success").show();
          $("body").addClass("modalFreeze");
       });
    }
  }
})

App.VolunteerView = Ember.View.extend({
  templateName: "volunteer",
  name: "",
  email: "",
  location: "",
  other: "",
  message: "",

  actions: {
    submit: function(event) {
      $.ajax({
        type: "POST",
        url: "https://mandrillapp.com/api/1.0/messages/send.json",
        data: {
          'key': 'ZMiPM6bTRAzqjOaIqzn-tA',
          'message': {
            'from_email': this.get("email"),
            'to': [
                {
                  'email': 'hello@wikitongues.org',
                  'name': 'Wikitongues',
                  'type': 'to'
                }
              ],
            'autotext': 'true',
            'subject': 'New Volunteer:'+this.get("location"),
            'html': "Name of submitter: "+this.get("name")+
              "<br/>Email: "+this.get("email")+
              "<br/>Location of volunteer: "+this.get("location")+
              "<br/>Ambassador: "+this.get("ambassador")+
              "<br/>Social Media: "+this.get("socialMedia")+
              "<br/>Developer: "+this.get("webDev")+
              "<br/>Other: "+this.get("other")+
              "<br/>Message: "+this.get("message")
          }
        }
       }).done(function(response) {
        var status = response[0].status;
        if(status == 'sent')
          $("section.success").show();
          $("body").addClass("modalFreeze");
       });
    }
  }
})

App.ContactView = Ember.View.extend({
  templateName: "contact",
  name: "",
  email: "",
  message: "",

  actions: {
    submit: function(event) {
      $.ajax({
        type: "POST",
        url: "https://mandrillapp.com/api/1.0/messages/send.json",
        data: {
          'key': 'ZMiPM6bTRAzqjOaIqzn-tA',
          'message': {
            'from_email': this.get("email"),
            'to': [
                {
                  'email': 'hello@wikitongues.org',
                  'name': 'Wikitongues',
                  'type': 'to'
                }
              ],
            'autotext': 'true',
            'subject': 'New Message: '+this.get("message"),
            'html': "Name of submitter: "+this.get("name")+
              "<br/>Email: "+this.get("email")+
              "<br/>Message: "+this.get("message")
          }
        }
       }).done(function(response) {
        var status = response[0].status;
        if(status == 'sent')
          $("section.success").show();
          $("body").addClass("modalFreeze");
       });
    }
  }
})

App.ApplicationAdapter = DS.FixtureAdapter.extend({
});

App.Volunteer.FIXTURES = [
  {
    id:1,
    name: "Daniel Bogre Udell",
    location: "New York, USA",
    latitude:(-73.95328556215065),
    longitude: (40.649647902099495),
    photo: "img/faces/daniel.jpg"
  },
  {
    id:2,
    name: "Freddie Andrade",
    location: "New York, USA",
    latitude:(-73.95328556215065),
    longitude: (40.649647902099495),
    photo: "img/faces/freddie.jpg"
  },
  {
    id:3,
    name: "Lindie Botes",
    location: "Pretoria, South Africa",
    latitude:(28.188055599999988),
    longitude: (-25.7461111),
    photo: "img/faces/lindie.jpg"
  },
  {
    id:4,
    name: "Cathy Zhang",
    location: "New York, USA",
    latitude:(28.188055599999988),
    longitude: (-25.7461111),
    photo: "img/faces/cathy.jpg"
  },
  {
    id:5,
    name: "Pau Mateo",
    location: "Kaunas, Lithuania",
    latitude:(23.90359650000005),
    longitude: (54.8985207),
    photo: "img/faces/pau.jpg"
  },
  {
    id:6,
    name: "Manjusha Raveendran",
    location: "Buffalo, USA",
    latitude:(-73.9780035),
    longitude: (40.7056308),
    photo: "img/faces/manjusha.jpg"
  },
  {
    id:7,
    name: "Madeleine Koerner",
    location: "Moscow, Russia",
    latitude:(37.6173),
    longitude: (55.755826),
    photo: "img/faces/madeleine.jpg"
  },
  {
    id:8,
    name: "Sarah Doyle",
    location: "Port Vila, Vanuatu",
    latitude:(168.32732450000003),
    longitude: (-17.7332512),
    photo: "img/faces/sarah.jpg"
  },
  {
    id:9,
    name: "Plator Gashi",
    location: "Prishtina, Kosovo",
    latitude:(1.1431885),
    longitude:(242.6582018),
    photo: "img/faces/plator.jpg"
  },
  {
    id:10,
    name: "Teddy Nee",
    location: "Guishan, Taiwan",
    latitude:(20.22687580000002),
    longitude:(122.9998999),
    photo: "img/faces/teddy.jpg"
  },
  {
    id:11,
    name: "Maxi Salomone",
    location: "Bahia Blanca, Argentina",
    latitude:(-62.26807780000002),
    longitude: (-38.71167760000001),
    photo: "img/faces/maxi.jpg"
  },
  {
    id:12,
    name: "Hugo Campbell Sills",
    location: "Bordeaux, France",
    latitude:(-0.5791799999999512),
    longitude: (44.837789),
    photo: "img/faces/hugo.jpg"
  },
  {
    id:13,
    name: "Fatuma A Abdullahi",
    location: "Doha, Qatar",
    latitude:(36.82194619999996),
    longitude: (-1.2920659),
    photo: "img/faces/yasmeen.jpg"
  },
  {
    id:14,
    name: "Luis Miguel Rojas-Berscia",
    location: "Nijmegen, Netherlands",
    latitude:(4.351710300000036),
    longitude: (50.8503396),
    photo: "img/faces/luis.jpg"
  },
  {
    id:15,
    name: "Andersson Causayá",
    location: "Popoyan, Colombia",
    latitude:(-76.60916700000001),
    longitude: (2.454167),
    photo: "img/faces/andersson.jpg"
  },
  {
    id:16,
    name: "Liam Neeve",
    location: "Edinburgh, Scotland",
    latitude:(-3.188266999999996),
    longitude: (55.953252),
    photo: "img/faces/liam.jpg"
  },
  {
    id:17,
    name: "Tatenda Chingono",
    location: "Harare, Zimbabue",
    latitude:(31.029722200000037),
    longitude: (-17.8638889),
    photo: "img/faces/tatenda.jpg"
  },
  {
    id:18,
    name: "Chris Voxland",
    location: "New York, USA",
    latitude:(-73.95328556215065),
    longitude: (40.649647902099495),
    photo: "img/faces/chrisVoxland.jpg"
  },
];

App.Phrase.FIXTURES = [
  {
    id:10001000,
    book:10000,
    sourcePhrase:"Hello",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Mba’éichapa.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001001,
    book:10000,
    sourcePhrase:"Goodbye.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Jajohecha peve.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001002,
    book:10000,
    sourcePhrase:"What is your name?",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Mba’éichapa nderéra?",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001003,
    book:10000,
    sourcePhrase:"My name is …",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Cheréra …",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001004,
    book:10000,
    sourcePhrase:"Do you speak English?",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Reñe’ẽkuaápa inglyesñe’ẽme?",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001005,
    book:10000,
    sourcePhrase:"Do you speak Spanish?",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Reñe’ẽkuaápa karaiñe’ẽme?",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001006,
    book:10000,
    sourcePhrase:"Yes.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Héẽ.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001007,
    book:10000,
    sourcePhrase:"No.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Nahániri.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001008,
    book:10000,
    sourcePhrase:"Thank you.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Aguyje.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001009,
    book:10000,
    sourcePhrase:"Thank you very much.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Aguyjevete ndéve.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001010,
    book:10001,
    sourcePhrase:"Me",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Mi",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001011,
    book:10001,
    sourcePhrase:"You",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Yu",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001012,
    book:10001,
    sourcePhrase:"This here",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Hem / hemia",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001013,
    book:10001,
    sourcePhrase:"Us / we",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Mifala ",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001014,
    book:10001,
    sourcePhrase:"All of us",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Mifala evriwan",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001015,
    book:10001,
    sourcePhrase:"You",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Yu",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001016,
    book:10001,
    sourcePhrase:"You (plural)",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Yufala",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001017,
    book:10001,
    sourcePhrase:"I do not know/understand",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Mi no save",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001018,
    book:10001,
    sourcePhrase:"See you later",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Lukim yu",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001019,
    book:10001,
    sourcePhrase:"I am going now",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Ale (French derivation of allez) mi go",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001020,
    book:10001,
    sourcePhrase:"One, two, three",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Wan, tu, tri",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001021,
    book:10001,
    sourcePhrase:"How much (is that)",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Hamas (long hem)",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001022,
    book:10001,
    sourcePhrase:"Plenty or many",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Plenti",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001023,
    book:10001,
    sourcePhrase:"Filled to capacity",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Fulap",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001024,
    book:10001,
    sourcePhrase:"Overfilled",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Fulap tumas (too much)",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001025,
    book:10001,
    sourcePhrase:"Day, evening, night",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Dei, sava (literally supper), naet",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001026,
    book:10001,
    sourcePhrase:"Hot, cold",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Hot, kol",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001027,
    book:10001,
    sourcePhrase:"What",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Wanem",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001028,
    book:10001,
    sourcePhrase:"What is that",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Wanem ia (lit. what here?)",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001029,
    book:10001,
    sourcePhrase:"Why / why did you",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Frowanem (for why?)",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001030,
    book:10001,
    sourcePhrase:"Please",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Plis",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001031,
    book:10001,
    sourcePhrase:"Thank you",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Tangkyu",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001032,
    book:10001,
    sourcePhrase:"Sorry",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Sori",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001033,
    book:10001,
    sourcePhrase:"Very sorry",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Sori tumas (lit. sorry too much)",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001034,
    book:10001,
    sourcePhrase:"Do you know",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Yu save (pronounced savee)",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001035,
    book:10002,
    sourcePhrase:"Goeie dag.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Hello. (formal)",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001036,
    book:10002,
    sourcePhrase:"Hallo.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Hello. (informal)",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001037,
    book:10002,
    sourcePhrase:"Hoe gaan dit?",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"How are you?",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001038,
    book:10002,
    sourcePhrase:"Goed, dankie.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Fine, thank you.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001039,
    book:10002,
    sourcePhrase:"Wat is jou naam?",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"What is your name?",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001040,
    book:10002,
    sourcePhrase:"My naam is ______.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"My name is ______.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001041,
    book:10002,
    sourcePhrase:"Aangename kennis.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Nice to meet you.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001042,
    book:10002,
    sourcePhrase:"Asseblief.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Please.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001043,
    book:10002,
    sourcePhrase:"Dankie.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Thank you.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001044,
    book:10002,
    sourcePhrase:"Dis 'n plesier.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"You're welcome.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001045,
    book:10002,
    sourcePhrase:"Ja.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Yes.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001046,
    book:10002,
    sourcePhrase:"Nee.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"No.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001047,
    book:10002,
    sourcePhrase:"Verskoon my.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Excuse me. (getting attention)",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001048,
    book:10002,
    sourcePhrase:"Verskoon my / Jammer.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Excuse me. (begging pardon)",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001049,
    book:10002,
    sourcePhrase:"Ek is jammer.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"I'm sorry.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001050,
    book:10002,
    sourcePhrase:"Totsiens.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Goodbye",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001051,
    book:10002,
    sourcePhrase:"Baai.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Goodbye (informal)",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001052,
    book:10002,
    sourcePhrase:"Ek kan nie [ goed ] Afrikaans praat nie.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"I can't speak Afrikaans [well].",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001053,
    book:10002,
    sourcePhrase:"Praat jy Engels?",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Do you speak English?",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001054,
    book:10002,
    sourcePhrase:"Is hier iemand wat Engels praat?",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Is there someone here who speaks English?",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001055,
    book:10002,
    sourcePhrase:"Help!",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Help!",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001056,
    book:10002,
    sourcePhrase:"Oppas!",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Look out!",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001057,
    book:10002,
    sourcePhrase:"Goeie môre.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Good morning.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001058,
    book:10002,
    sourcePhrase:"Goeie naand.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Good evening.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001059,
    book:10002,
    sourcePhrase:"Goeie nag.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Good night. (to sleep)",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001060,
    book:10002,
    sourcePhrase:"Ek verstaan nie.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"I don't understand.",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001061,
    book:10002,
    sourcePhrase:"Waar is die toilet?",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"Where is the toilet?",
    targetAudio:"",
    targetVideo:""
  },{
    id:10001062,
    book:10002,
    sourcePhrase:"Ek dra 'n denim broek.",
    sourceAudio:"",
    sourceVideo:"",
    targetPhrase:"I am wearing jeans.",
    targetAudio:"",
    targetVideo:""
  }
]

App.Book.FIXTURES = [
  {
    id:10000,
    language: "esp",
    dateCreated: "1/15/15",
    lastEdited: "Today",
    createdBy: "Hugo Campbell Sills",
    location: "New York, NY, USA",
    release: "Public",
    sourceISO: "ESP",
    sourceName: "Español",
    targetISO: "GRN",
    targetName: "Guaraní",
    phrases: [10001000,10001001,10001002,10001003,10001004,10001005,10001006,10001007,10001008,10001009],
    title: "Introducción à Guarany",
    banner: true,
    bannerUrl: "img/faces/hugo.jpg",
    sounds: false,
    videos: false,
    editing: false,
    comments: false,
    // phraseCount: 10,
    views: 0,
    saves: 0,
    shares: 0,
    embeds: 0
  },
  {
    id:10001,
    language: "eng",
    dateCreated: "1/15/15",
    lastEdited: "Today",
    createdBy: "Sarah Doyle",
    location: "New York, NY, USA",
    release: "Public",
    sourceISO: "ENG",
    sourceName: "English",
    targetISO: "BIS",
    targetName: "Bislama",
    phrases: [10001010,10001011,10001012,10001013,10001014,10001015,10001016,10001017,10001018,10001019,10001020,10001021,10001022,10001023,10001024,10001025,10001026,10001027,10001028,10001029,10001030,10001031,10001032,10001033,10001034],
    title: "Basic Bislama Phrases",
    banner: true,
    bannerUrl: "img/faces/sarah.jpg",
    sounds: false,
    videos: false,
    editing: false,
    comments: false,
    // phraseCount: 25,
    views: 0,
    saves: 0,
    shares: 0,
    embeds: 0
  },
  {
    id:10002,
    language: "eng",
    dateCreated: "1/15/15",
    lastEdited: "Today",
    createdBy: "Lindie Botes",
    location: "New York, NY, USA",
    release: "Public",
    sourceISO: "AFR",
    sourceName: "Afrikaans",
    targetISO: "ENG",
    targetName: "Engels",
    phrases: [10001035,10001036,10001037,10001038,10001039,10001040,10001041,10001042,10001043,10001044,10001045,10001046,10001047,10001048,10001049,10001050,10001051,10001052,10001053,10001054,10001055,10001056,10001057,10001058,10001059,10001060,10001061,10001062],
    title: "Engels Vir Werk",
    banner: true,
    bannerUrl: "img/faces/lindie.jpg",
    sounds: false,
    videos: false,
    editing: false,
    comments: false,
    // phraseCount: 28,
    views: 0,
    saves: 0,
    shares: 0,
    embeds: 0
  },
  {
    id:10003,
    language: "eng",
    dateCreated: "1/15/15",
    lastEdited: "Today",
    createdBy: "Cathy Zhang",
    location: "New York, NY, USA",
    release: "Public",
    sourceISO: "ENG",
    sourceName: "English",
    targetISO: "BIS",
    targetName: "Mandarin",
    phrases: [],
    title: "Mandarin for the Ex-Pat",
    banner: true,
    bannerUrl: "img/faces/cathy.jpg",
    sounds: false,
    videos: false,
    editing: false,
    comments: false,
    // phraseCount: 0,
    views: 0,
    saves: 0,
    shares: 0,
    embeds: 0
  },
  {
    id:10004,
    language: "eng",
    dateCreated: "1/15/15",
    lastEdited: "Today",
    createdBy: "Pau Matteo",
    location: "New York, NY, USA",
    release: "Public",
    sourceISO: "Cat",
    sourceName: "Catalá",
    targetISO: "Lit",
    targetName: "Lithuanian",
    phrases: [],
    title: "Un Catalá en Lituania v1",
    banner: true,
    bannerUrl: "img/faces/pau.jpg",
    sounds: false,
    videos: false,
    editing: false,
    comments: false,
    // phraseCount: 0,
    views: 0,
    saves: 0,
    shares: 0,
    embeds: 0
  },
  {
    id:10005,
    language: "eng",
    dateCreated: "1/15/15",
    lastEdited: "Today",
    createdBy: "Plator Gashi",
    location: "New York, NY, USA",
    release: "Public",
    sourceISO: "AFR",
    sourceName: "Albanian",
    targetISO: "ENG",
    targetName: "Gheg Albanian",
    phrases: [],
    title: "Kosovo Albanian",
    banner: true,
    bannerUrl: "img/faces/plator.jpg",
    sounds: false,
    videos: false,
    editing: false,
    comments: false,
    // phraseCount: 0,
    views: 0,
    saves: 0,
    shares: 0,
    embeds: 0
  }
]