
export const handleInputChangee = (event, setName, setEmail, setBio, setDob, setCity, setSelectedCountry,setPhoneNumber) => {
  const target = event.target;
  const value = target.type === 'checkbox' ? target.checked : target.value;
  const name = target.name;
  switch (name) {
    case 'name':
      setName(value);
      break;
    case 'email':
      setEmail(value);
      break;
    case 'bio':
      setBio(value);
      break;
    case 'dob':
      setDob(value);
      break;
    case 'city':
      setCity(value);
      break;
    case 'selectedCountry':
      setSelectedCountry(value)
      break;
      case 'phone':
      setPhoneNumber(value)
      break;
    default:
      break;
  }
};
