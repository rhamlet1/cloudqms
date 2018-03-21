Template.register.events({
  'submit form': (event) => {
    event.preventDefault();
  },
});

Template.register.onRendered(() => {
  const validator = $('.register').validate({
    submitHandler: () => {
      const email = $('[name=email]').val();
      const password = $('[name=password]').val();
      const confirmPassword = $('[name=confirmPassword]').val();
      const forename = $('[name=forename]').val();
      const surname = $('[name=surname]').val();
      const jobTitle = $('[name=jobTitle]').val();
      const company = $('[name=company]').val();
      if (password !== confirmPassword) {
        validator.showErrors({
          confirmPassword: 'Password and confirm password do not match.'
        });
      } else {
        Meteor.call(
          "addUser",
          email,
          password,
          forename,
          surname,
          jobTitle,
          company
        );
/*
        Accounts.createUser({
          email,
          password,
          profile: {
            forename,
            surname,
            jobTitle,
            company,
          },
        }, (error) => {
          if (error) {
            if (error.reason === 'Email already exists.') {
              validator.showErrors({
                email: 'That email address is already registered.'
              });
              const userEmail = $('[name=email]').val();
//              logActivity(
//                '',
//                'Users',
//                userEmail,
//                'Attempt to register account using existing email address.'
//              );
              console.log("User account already exists");
            }
            console.log("Error: " + error);
          } else {
            const currentUser = Meteor.userId();
            if (currentUser) {
//              const activity = 'Account created for user ' + getUserName() + '.';
//              logActivity(
//                currentUser,
//                'Users',
//                currentUser,
//                activity,
//              );
//              sendEmailToAdmin(
//                Meteor.user().emails[0].address,
//                'Registration notification',
//                getUserName() + ' requests roles to be set up.'
//              );
//              insertUserActionsTable(Meteor.userId());
//              insertUserContactsTable(Meteor.userId());
//              insertUserContactsParams(Meteor.userId());
              console.log("User account created");
            } else {
              const userEmail = $('[name=email]').val();
//              logActivity(
//                '',
//                'Users',
//                userEmail,
//                'Attempted account registration failed.',
//              );
              console.log("User account creation failed");
            }
            Router.go('home');
          }
        });
*/
      }
    },
  });
});

Template.login.events({
  'submit .login': (event) => {
    event.preventDefault();
  },
});

Template.login.onRendered(() => {
  const validator = $('.login').validate({
    submitHandler: () => {
      const email = $('[name=email]').val();
      const password = $('[name=password]').val();
      Meteor.loginWithPassword(email, password, (error) => {
        if (error) {
          if (error.reason === 'User not found') {
            validator.showErrors({
              email: 'That email address is not registered.',
            });
            const userEmail = $('[name=email]').val();
//            logActivity(
//              '',
//              'Users',
//              userEmail,
//              'Attempt to login using unregistered email address.',
//            );
          }
          if (error.reason === 'Incorrect password') {
            validator.showErrors({
              password: 'You entered an incorrect password.',
            });
            const userEmail = $('[name=email]').val();
//            logActivity(
//              '',
//              'Users',
//              userEmail,
//              'Attempt to login with incorrect password.',
//            );
          }
        } else {
          const currentUser = Meteor.userId();
          if (currentUser) {
            const thisUser = Meteor.users.findOne({ _id: currentUser });
            const activity = getUserName() + ' logged in.';
//            logActivity(
//              currentUser,
//              'Users',
//              currentUser,
//              activity,
//            );
          } else {
            const userEmail = $('[name=email]').val();
//            logActivity(
//              '',
//              'Users',
//              userEmail,
//              'Attempted account login failed.',
//            );
          }
          const currentRoute = Router.current().route.getName();
          if (currentRoute === 'login') {
            Router.go('home');
          }
        }
      });
    },
  });
});
