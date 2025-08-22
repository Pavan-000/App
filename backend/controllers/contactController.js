import  Contact  from "../models/contact.js";

export const addContact = async (req, res) => {
  const { user_id, contact_id } = req.body;
  try {
    const contact = await Contact.create({ user_id, contact_id });
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getContacts = async (req, res) => {
  const { user_id } = req.params;
  try {
    const contacts = await Contact.findAll({ where: { user_id } });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
