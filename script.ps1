function Get-TreeStructure {
    param (
        [string]$Path,
        [int]$Indent = 0,
        [string[]]$Exclude = @("node_modules")
    )

    # Lista todos os itens no diretório
    Get-ChildItem -Path $Path | Where-Object { 
        -not ($_.PSIsContainer -and $Exclude -contains $_.Name) 
    } | ForEach-Object {
        $prefix = (" " * $Indent) + "|-- "
        $output = $prefix + $_.Name

        # Adiciona ao arquivo de saída
        $output | Out-File -FilePath "./Ficheiro.txt" -Append

        # Se for uma pasta, chama a função recursivamente
        if ($_.PSIsContainer) {
            Get-TreeStructure -Path $_.FullName -Indent ($Indent + 4) -Exclude $Exclude
        }
    }
}

# Limpa o arquivo de saída antes de começar
Remove-Item "./Ficheiro.txt" -ErrorAction SilentlyContinue

# Gera a estrutura, excluindo "node_modules"
Get-TreeStructure -Path "./"