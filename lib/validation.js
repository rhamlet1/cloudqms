$.validator.setDefaults({
  rules: {
    // login, register
    email: {
      required: true,
      email: true,
    },
    password: {
      required: true,
      minlength: 6,
    },
    forename: {
      required: true,
    },
    surname: {
      required: true,
    },
    jobTitle: {
      required: true,
    },
    company: {
      required: true,
    },
  },
  messages: {
    // login, register
    email: {
      required: 'You must enter a valid email address.',
      email: 'You have entered an invalid email address.',
    },
    password: {
      required: 'You must enter your password.',
      minlength: 'The password must be a minimum of {0} characters.',
    },
    forename: {
      required: 'You must enter your first name.',
    },
    surname: {
      required: 'You must enter your family name.',
    },
    jobTitle: {
      required: 'You must enter your company position.',
    },
    company: {
      required: 'You must enter your organisation name.',
    },
  },
});
