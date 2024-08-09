let _ = {};

_.name = () => {
  const regex = "[\\-\\'A-Za-z0-9 ]+";
  const constraints = {
    presence: {
      allowEmpty: false,
    },
    type: "string",
    format: {
      pattern: regex,
      flags: "i",
      message: "name must match the following pattern: " + regex,
    },
  };

  return constraints; // Return the constraints object
};

_.email = () => {
  const constraints = {
    presence: { allowEmpty: false },
    type: "string", // Corrected to a string
    email: true, // Ensures the value is a valid email
  };

  return constraints; // Return the constraints object
};

_.password = () => {
  const constraints = {
    presence: { allowEmpty: false },
    type: "string",
    length: {
      minimum: 6,
    },
  };

  return constraints;
};

module.exports = _;
