const required = (value, field) => {
    if (value === undefined || value === null || value === '') {
        return `O campo '${field}' é obrigatório.`;
    }
    return null;
};

const isEmail = (value, field) => {
    if (value === undefined || value === null || value === '') return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return `O campo '${field}' deve ser um e-mail válido.`;
    }
    return null;
};

const minLength = (min) => (value, field) => {
    if (value === undefined || value === null || value === '') return null;
    if (value.length < min) {
        return `O campo '${field}' deve ter no mínimo ${min} caracteres.`;
    }
    return null;
};

const isNumber = (value, field) => {
    if (value === undefined || value === null || value === '') return null;
    if (typeof value !== 'number' && isNaN(Number(value))) {
        return `O campo '${field}' deve ser um número.`;
    }
    return null;
};

const isPositive = (value, field) => {
    if (value === undefined || value === null || value === '') return null;
    if (Number(value) <= 0) {
        return `O campo '${field}' deve ser maior que zero.`;
    }
    return null;
};

const isOneOf = (allowedValues) => (value, field) => {
    if (value === undefined || value === null || value === '') return null;
    if (!allowedValues.includes(Number(value))) {
        return `O campo '${field}' deve ser um dos seguintes valores: ${allowedValues.join(', ')}.`;
    }
    return null;
};

const isStringOneOf = (allowedValues) => (value, field) => {
    if (value === undefined || value === null || value === '') return null;
    if (!allowedValues.includes(value)) {
        return `O campo '${field}' deve ser um dos seguintes valores: ${allowedValues.join(', ')}.`;
    }
    return null;
};

const validate = (rules) => {
    return (req, res, next) => {
        const errors = [];
        
        for (const [field, validators] of Object.entries(rules)) {
            const value = req.body[field];
            
            for (const validator of validators) {
                const error = validator(value, field, req.body);
                if (error) {
                    errors.push(error);
                    break;
                }
            }
        }
        
        if (errors.length > 0) {
            return res.status(400).json({ error: errors.join(' | ') });
        }
        
        next();
    };
};

module.exports = {
    validate,
    rules: {
        register: {
            name: [required, minLength(2)],
            email: [required, isEmail],
            password: [required, minLength(6)]
        },
        login: {
            email: [required, isEmail],
            password: [required]
        },
        transactionCreate: {
            amount: [required, isNumber, isPositive],
            description: [required, minLength(3)],
            date: [required],
            type: [required, isOneOf([0, 1])],
            currency: [isStringOneOf(['BRL', 'USD', 'EUR'])],
            exchangeRate: [isNumber, isPositive]
        },
        transactionUpdate: {
            amount: [isNumber, isPositive],
            type: [isOneOf([0, 1])],
            currency: [isStringOneOf(['BRL', 'USD', 'EUR'])],
            exchangeRate: [isNumber, isPositive]
        },
        goalCreate: {
            title: [required, minLength(3)],
            target: [required, isNumber, isPositive],
            current: [isNumber]
        },
        goalUpdate: {
            target: [isNumber, isPositive],
            current: [isNumber]
        }
    }
};
