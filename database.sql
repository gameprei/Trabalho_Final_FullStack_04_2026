CREATE TABLE atletas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    rg VARCHAR(20),
    orgao_emissor VARCHAR(20),
    
    endereco VARCHAR(255),
    bairro VARCHAR(100),
    municipio VARCHAR(100),
    cep VARCHAR(10),
    uf CHAR(2),
    
    telefone VARCHAR(20),
    celular VARCHAR(20),
    email VARCHAR(150),
    
    clube_equipe VARCHAR(150),
    
    peso DECIMAL(5,2),
    altura DECIMAL(5,2),
    
    restricao_medica TEXT,
    
    contato_emergencia_nome VARCHAR(150),
    contato_emergencia_telefone VARCHAR(20),
    
    categoria ENUM('Amador', 'Semi-Profissional', 'Profissional') NOT NULL,
    faixa_etaria ENUM('Sub-15', 'Sub-17', 'Sub-20', 'Adulto', 'Master') NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE modalidades (
    mod_id INT AUTO_INCREMENT PRIMARY KEY,
    mod_nome VARCHAR(100) UNIQUE NOT NULL,
    mod_categoria ENUM('Amador', 'Semi-Profissional', 'Profissional') NOT NULL,
    mod_faixa_etaria ENUM('Sub-15', 'Sub-17', 'Sub-20', 'Adulto', 'Master'),
    mod_vagas INT NOT NULL,
    mod_descricao TEXT,
    mod_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inscricoes (
    ins_id INT AUTO_INCREMENT PRIMARY KEY,
    
    atleta_id INT NOT NULL,
    modalidade_id INT NOT NULL,

    ins_data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ins_atleta 
        FOREIGN KEY (atleta_id) REFERENCES atletas(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ins_modalidade 
        FOREIGN KEY (modalidade_id) REFERENCES modalidades(mod_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_inscricao 
        UNIQUE (atleta_id, modalidade_id)
);

DELIMITER $$

CREATE TRIGGER trg_inscricao_insert
AFTER INSERT ON inscricoes
FOR EACH ROW
BEGIN
    UPDATE modalidades
    SET mod_vagas = mod_vagas - 1
    WHERE mod_id = NEW.modalidade_id;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_inscricao_delete
AFTER DELETE ON inscricoes
FOR EACH ROW
BEGIN
    UPDATE modalidades
    SET mod_vagas = mod_vagas + 1
    WHERE mod_id = OLD.modalidade_id;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_check_vagas
BEFORE INSERT ON inscricoes
FOR EACH ROW
BEGIN
    DECLARE vagas INT;

    SELECT mod_vagas INTO vagas
    FROM modalidades
    WHERE mod_id = NEW.modalidade_id;

    IF vagas <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Sem vagas disponíveis';
    END IF;
END$$

DELIMITER ;


INSERT INTO modalidades 
(mod_nome, mod_categoria, mod_faixa_etaria, mod_vagas, mod_descricao) VALUES

('Futebol de Campo', 'Amador', 'Adulto', 22, 'Modalidade coletiva tradicional com times de 11 jogadores'),
('Futsal Sub-17', 'Amador', 'Sub-17', 14, 'Competição de futsal para atletas até 17 anos'),
('Basquete Profissional', 'Profissional', 'Adulto', 10, 'Liga profissional de basquete'),
('Vôlei Feminino', 'Semi-Profissional', 'Adulto', 12, 'Competição feminina de voleibol'),
('Natação 100m Livre', 'Amador', 'Adulto', 8, 'Prova individual de velocidade na natação'),
('Corrida 5km', 'Amador', 'Adulto', 100, 'Corrida de rua de média distância'),
('Jiu-Jitsu Master', 'Semi-Profissional', 'Master', 20, 'Competição para atletas acima de 35 anos'),
('Tênis Sub-20', 'Amador', 'Sub-20', 16, 'Torneio juvenil de tênis'),
('Handebol Profissional', 'Profissional', 'Adulto', 14, 'Liga nacional de handebol'),
('Atletismo Sub-15', 'Amador', 'Sub-15', 30, 'Competição de atletismo para jovens atletas');

INSERT INTO atletas (
    nome_completo,
    data_nascimento,
    cpf,
    rg,
    orgao_emissor,
    endereco,
    bairro,
    municipio,
    cep,
    uf,
    telefone,
    celular,
    email,
    clube_equipe,
    peso,
    altura,
    restricao_medica,
    contato_emergencia_nome,
    contato_emergencia_telefone,
    categoria,
    faixa_etaria
) VALUES

('Lucas Silva Pereira', '2005-03-15', '123.456.789-00', '12345678', 'SSP',
'Rua das Flores, 123', 'Centro', 'São Paulo', '01010-000', 'SP',
'1130000000', '11990000000', 'lucas@email.com',
'Clube SP', 70.5, 175.0, NULL,
'Maria Silva', '11980000000',
'Amador', 'Sub-20'),

('Ana Beatriz Souza', '1998-07-22', '987.654.321-00', '87654321', 'SSP',
'Av. Paulista, 1000', 'Bela Vista', 'São Paulo', '01310-100', 'SP',
'1131111111', '11991111111', 'ana@email.com',
'Equipe Alpha', 60.0, 165.0, 'Asma leve',
'Carlos Souza', '11982222222',
'Semi-Profissional', 'Adulto'),

('Rafael Oliveira Santos', '1985-11-10', '456.789.123-00', '45612378', 'SSP',
'Rua A, 45', 'Zona Norte', 'São Paulo', '02020-000', 'SP',
'1132222222', '11992222222', 'rafael@email.com',
'Time Beta', 82.3, 180.0, NULL,
'Fernanda Oliveira', '11983333333',
'Profissional', 'Master'),

('Juliana Costa Lima', '2008-01-05', '321.654.987-00', '78945612', 'SSP',
'Rua B, 200', 'Zona Sul', 'São Paulo', '04040-000', 'SP',
'1133333333', '11993333333', 'juliana@email.com',
'Clube Jovem', 55.0, 160.0, NULL,
'Patricia Costa', '11984444444',
'Amador', 'Sub-17'),

('Bruno Henrique Alves', '2003-09-30', '159.753.456-00', '15935748', 'SSP',
'Rua C, 78', 'Centro', 'São Paulo', '01111-000', 'SP',
'1134444444', '11994444444', 'bruno@email.com',
'Equipe Delta', 75.0, 178.0, 'Lesão no joelho',
'Ricardo Alves', '11985555555',
'Semi-Profissional', 'Adulto');